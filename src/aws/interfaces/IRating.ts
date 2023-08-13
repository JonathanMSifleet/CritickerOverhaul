export default interface IRating {
  createdAt: number;
  imdbID: number;
  rating: number;
  ratingPercentile?: number;
  review?: string;
  username: string;
}
