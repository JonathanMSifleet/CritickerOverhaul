export default interface IRating {
  UID: string;
  createdAt?: number;
  imdb_title_id: number;
  rating: number;
  review?: string;
}
