const aws = require('aws-sdk');

const GetReview = require('../../backend/aws/handlers/getReview');
const GetReviewBySlug = require('../../backend/aws/lib/review/getReviewBySlug');

const mockReview = require('../../libData/mockReview.json');

// required to simulate event.pathParameters
const LambdaTester = require('lambda-tester');

GetReview.getReview = jest.fn();
GetReviewBySlug.getReviewBySlug = jest.fn();

let statusCode;
let body;
let errorMessage;

const reviewSlug = 'borderlands-3';

describe(GetReviewBySlug.getReviewBySlug, () => {
  it('should have a getReviewBySlug function', () => {
    expect(typeof GetReviewBySlug.getReviewBySlug).toBe('function');
  });

  it('should call GetReviewBySlug.getReviewBySlug with slug parameter', async () => {
    await GetReviewBySlug.getReviewBySlug(reviewSlug);
    expect(GetReviewBySlug.getReviewBySlug).toBeCalledWith(reviewSlug);
  });

  it('should return review', async () => {
    GetReviewBySlug.getReviewBySlug.mockReturnValue(mockReview);
    const result = await GetReviewBySlug.getReviewBySlug(reviewSlug);
    expect(result).toStrictEqual(mockReview);
  });
});

describe('GetReview.getReview', () => {
  beforeEach(() => {
    body; // = allReviews;
    statusCode; // = 200;
    errorMessage; // = 'Error finding';
  });

  it('should have a getReview function', () => {
    expect(typeof GetReview.getReview).toBe('function');
  });

  // not possible to write this unit test due to pathParameters
  // it('should call GetReview.getReview with route parameters', async () => {});

  it('should return json body and response code 200', async () => {
    GetReview.getReview.mockReturnValueOnce(mockReview);

    // must use lambdaTester due to event.pathParameter
    // counts as one test, will fail if either expect fails
    await LambdaTester(GetReview.handler)
      .event({ pathParameters: { slug: reviewSlug } })
      .expectResult((result) => {
        expect(JSON.parse(result.statusCode)).toBe(200);
        expect(JSON.parse(result.body)).toStrictEqual(mockReview);
      });
  });

  it('should do error handling', async () => {
    GetReview.getReview.mockReturnValue(null);

    // must use lambdaTester due to event.pathParameter
    // counts as one test, will fail if either expect fails
    await LambdaTester(GetReview.handler)
      .event({ pathParameters: { slug: null } })
      .expectResult((result) => {
        expect(JSON.parse(result.statusCode)).toBe(200);
        expect(JSON.parse(result.body)).toStrictEqual(mockReview);
      });
  });
});
