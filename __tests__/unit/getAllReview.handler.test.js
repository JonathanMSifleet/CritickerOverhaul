const aws = require('aws-sdk');

const GetAllReviews = require('../../backend/aws/handlers/getAllReviews');
const allReviews = require('../../libData/all-reviews.json');

jest.mock('aws-sdk');

GetAllReviews.getAllReviews = jest.fn();

let statusCode;
let body;
let errorMessage;

describe('GetAllReviews.getAllReviews', () => {
  beforeEach(() => {
    body = allReviews;
    statusCode = 200;
    errorMessage = 'Error finding';
  });

  it('should have a getAllReviews function', () => {
    expect(typeof GetAllReviews.getAllReviews).toBe('function');
  });

  it('should call GetAllReviews.getAllReviews', () => {
    GetAllReviews.getAllReviews();
    expect(GetAllReviews.getAllReviews).toHaveBeenCalledWith();
  });

  it('should return 200 response code and all reviews', async () => {
    GetAllReviews.getAllReviews.mockReturnValue(statusCode, body);
    await GetAllReviews.getAllReviews();
    expect(statusCode).toBe(200);
    expect(body).toStrictEqual(allReviews);
  });

  it('should handle errors in getAllReviews', async () => {
    statusCode = 404;
    GetAllReviews.getAllReviews.mockReturnValue(statusCode, errorMessage);
    await GetAllReviews.getAllReviews();
    expect(statusCode).toBe(404);
    expect(errorMessage).toBe(errorMessage);
  });
});
