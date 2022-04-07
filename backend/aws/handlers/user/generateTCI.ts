import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IRating {
  imdbID: number;
  ratingPercentile: number;
}

interface IUserRatings {
  username: string;
  ratings: IRating[];
}

const generateTCI = async (event: {
  pathParameters: { usernameOne: string; usernameTwo: string };
}): Promise<IHTTP | void> => {
  const { usernameOne, usernameTwo } = event.pathParameters;

  const userRatingRequests = [];
  userRatingRequests.push(getUserRatings(usernameOne));
  userRatingRequests.push(getUserRatings(usernameTwo));

  const userRatings = (await Promise.all(userRatingRequests)) as IUserRatings[];
  if (userRatings instanceof Error) return createAWSResErr(500, 'Error getting user ratings');

  const matchingRatings = getMatchingUserRatings(userRatings as IUserRatings[]);
  if (matchingRatings.length < 25) return createAWSResErr(404, 'Not enough matching ratings found');

  const ratingsOne = filterRatings(userRatings[0], matchingRatings);
  const ratingsTwo = filterRatings(userRatings[1], matchingRatings);

  const tci = calculateTCI(matchingRatings, ratingsOne, ratingsTwo);
  const tableHash = usernameOne < usernameTwo ? `${usernameOne}-${usernameTwo}` : `${usernameTwo}-${usernameOne}`;

  const updatedTCI = await updateDynamoTCI(tableHash, tci);
  if (updatedTCI instanceof Error) return createAWSResErr(500, 'Error updating TCI');

  return { statusCode: 204 };
};

export const handler = middy(generateTCI).use(cors());

const calculateAbsolutePercentageDifference = (valOne: number, valTwo: number): number => {
  if (valOne > valTwo) {
    const temp = valOne;
    valOne = valTwo;
    valTwo = temp;
  }

  return Math.round(Math.abs(((valOne - valTwo) / valTwo) * 100));
};

const calculateTCI = (matchingRatings: IRating[], ratingsOne: IUserRatings, ratingsTwo: IUserRatings): number => {
  const percentageDifferences = matchingRatings.map(
    (matchingRating) =>
      ({
        percentageDifference: calculateAbsolutePercentageDifference(
          // @ts-expect-error can be used as index
          ratingsOne[matchingRatings.indexOf(matchingRating)].ratingPercentile,
          // @ts-expect-error can be used as index
          ratingsTwo[matchingRatings.indexOf(matchingRating)].ratingPercentile
        )
      }.percentageDifference)
  );

  return Number((percentageDifferences.reduce((a, b) => a + b) / percentageDifferences.length).toFixed(4));
};

const getMatchingUserRatings = (ratings: IUserRatings[]): IRating[] =>
  ratings[0].ratings.filter((ratingOne) =>
    ratings[1].ratings.some((ratingTwo) => ratingTwo.imdbID === ratingOne.imdbID)
  );

const getUserRatings = async (username: string): Promise<IHTTP | IUserRatings> => {
  const query = {
    TableName: process.env.USER_RATINGS_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    ProjectionExpression: 'ratings'
  };

  try {
    const result = await dbClient.send(new GetItemCommand(query));
    const ratings = JSON.parse(unmarshall(result.Item!).ratings);

    return {
      ratings,
      username
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const filterRatings = (userRatings: IUserRatings, matchingRatings: IRating[]): IUserRatings =>
  // @ts-expect-error ratings does exist on IUserRatings
  userRatings.ratings.filter((rating: { imdbID: number }) =>
    matchingRatings.some((matchingRating) => matchingRating.imdbID === rating.imdbID)
  );

const updateDynamoTCI = async (tableHash: string, tci: number): Promise<IHTTP | void> => {
  const query = {
    TableName: process.env.TCI_TABLE_NAME!,
    Item: {
      usernames: { S: tableHash },
      tci: { N: tci.toString() }
    }
  };

  try {
    await dbClient.send(new PutItemCommand(query));
    console.log('Successfully updated TCI');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }
};
