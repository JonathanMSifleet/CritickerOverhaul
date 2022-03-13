export default interface IUserReview {
  createdAt: number;
  review: {
    rating: number;
    reviewText?: string;
  };
}
