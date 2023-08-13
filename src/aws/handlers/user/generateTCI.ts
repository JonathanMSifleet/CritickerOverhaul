import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import getExistingTCI from '../../shared/functions/getExistingTCI';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import ITCI from '../../interfaces/ITCI';

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
  pathParameters: { primaryUsername: string; secondaryUsername: string };
}): Promise<IHTTP> => {
  const { primaryUsername, secondaryUsername } = event.pathParameters;

  const userRatingRequests = [];
  userRatingRequests.push(getUserRatings(primaryUsername));
  userRatingRequests.push(getUserRatings(secondaryUsername));

  const userRatings = (await Promise.all(userRatingRequests)) as IUserRatings[];
  if (userRatings instanceof Error) return createAWSResErr(500, 'Error getting user ratings');

  const matchingRatings = getMatchingUserRatings(userRatings as IUserRatings[]);
  if (matchingRatings.length < 25) return createAWSResErr(404, 'Not enough matching ratings found');

  const ratingsOne = filterRatings(userRatings[0], matchingRatings);
  const ratingsTwo = filterRatings(userRatings[1], matchingRatings);

  const strippedRatingsOne = stripRatings(ratingsOne);
  const strippedRatingsTwo = stripRatings(ratingsTwo);

  const newTCI = calculateTCI(strippedRatingsOne, strippedRatingsTwo);

  let existingTCIArray = await getExistingTCI(dbClient, primaryUsername);

  existingTCIArray = existingTCIArray.filter((existingTCI) => existingTCI.username !== secondaryUsername);
  existingTCIArray.push({ username: secondaryUsername, TCI: newTCI });

  const updatedTCI = await updateDynamoTCI(primaryUsername, existingTCIArray);
  if (updatedTCI instanceof Error) return createAWSResErr(500, 'Error updating TCI');

  return { statusCode: 204 };
};

export const handler = middy(generateTCI).use(cors());

const calculateTCI = (ratingsOne: number[], ratingsTwo: number[]): number => {
  const differences = ratingsOne.map((ratingOne, i) => Math.abs(ratingOne - ratingsTwo[i]));
  const sum = differences.reduce((acc, cur) => acc + cur, 0);
  return parseFloat((sum / differences.length).toFixed(8));
};

const getMatchingUserRatings = (ratings: IUserRatings[]): IRating[] =>
  ratings[0].ratings.filter((ratingOne) =>
    ratings[1].ratings.some((ratingTwo) => ratingTwo.imdbID === ratingOne.imdbID)
  );

const getUserRatings = async (username: string): Promise<IHTTP | IUserRatings> => {
  const query = {
    TableName: process.env.AGGREGATE_PERCENTILES_TABLE_NAME!,
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

const filterRatings = (userRatings: IUserRatings, matchingRatings: IRating[]): IRating[] =>
  userRatings.ratings.filter((rating: { imdbID: number }) =>
    matchingRatings.some((matchingRating) => matchingRating.imdbID === rating.imdbID)
  );

const stripRatings = (ratings: IRating[]): number[] =>
  ratings.sort((a, b) => a.imdbID - b.imdbID).map((rating) => rating.ratingPercentile);

const updateDynamoTCI = async (primaryUsername: string, tci: ITCI[]): Promise<IHTTP | void> => {
  const query = {
    TableName: process.env.TCI_TABLE_NAME!,
    Item: {
      username: { S: primaryUsername },
      TCIs: { S: JSON.stringify(tci) }
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
