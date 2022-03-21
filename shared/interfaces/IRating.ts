export default interface IRating {
  createdAt?: number;
  imdbID: number;
  rating: number;
  review?: string;
  username: string;
}
