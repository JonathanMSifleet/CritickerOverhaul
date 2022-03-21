interface IResult {
  imdb_title_id: number;
}

const mergeDynamoAndMudfootResults = (dynamoResults: IResult[], mudfootResults: IResult[]): IResult[] =>
  dynamoResults.map((dynamoResult) => {
    const matchingResult = mudfootResults.find(
      (mfResult: IResult) => mfResult.imdb_title_id === dynamoResult.imdb_title_id
    );

    return {
      ...dynamoResult,
      ...matchingResult
    };
  });

export default mergeDynamoAndMudfootResults;
