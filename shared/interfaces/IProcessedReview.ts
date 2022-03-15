export default interface IProcessedReview {
  imdb_title_id: number;
  review: {
    rating: number;
    reviewText?: string;
  };
  UID: string;
}