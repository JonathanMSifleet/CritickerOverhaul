const aws = require('aws-sdk');

const GetAllReviews = require('../../backend/aws/handlers/getAllReviews');
const allReviews = require('../mock-data/all-reviews.json');

jest.mock('aws-sdk');
const dynamoDB = new aws.DynamoDB.DocumentClient();

GetAllReviews.getAllReviews = jest.fn();

let statusCode;
let body;

describe('GetAllReviews.getAllReviews', () => {
  beforeEach(() => {
    body = allReviews;
    statusCode = 200;
  });
  it('should have a getAllReviews function', () => {
    expect(typeof GetAllReviews.getAllReviews).toBe('function');
  });
  it('should call GetAllReviews.getAllReviews', () => {
    GetAllReviews.getAllReviews();
    expect(GetAllReviews.getAllReviews).toHaveBeenCalledWith();
  });
  it('should return 200 response code and all reviews', async () => {
    // const statusCode = 200;
    // const body = allReviews;
    GetAllReviews.getAllReviews.mockReturnValue(statusCode, body);
    await GetAllReviews.getAllReviews();
    expect(statusCode).toBe(200);
    expect(body).toStrictEqual(allReviews);
  });
});
