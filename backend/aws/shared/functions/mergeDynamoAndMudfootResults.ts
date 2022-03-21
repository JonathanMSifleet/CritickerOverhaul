interface IResult {
  imdbID: number;
}

const mergeDynamoAndMudfootResults = (dynamoResults: IResult[], mudfootResults: IResult[]): IResult[] =>
  dynamoResults.map((dynamoResult) => {
    const matchingResult = mudfootResults.find((mfResult: IResult) => mfResult.imdbID === dynamoResult.imdbID);

    return {
      ...dynamoResult,
      ...matchingResult
    };
  });

export default mergeDynamoAndMudfootResults;
