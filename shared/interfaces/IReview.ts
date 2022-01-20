export default interface IReview {
  imdb_title_id: number;
  UID: string;
  review: {
    rating: number;
    reviewText?: string;
  };
}
