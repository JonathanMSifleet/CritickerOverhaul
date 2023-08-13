export default interface IHTTP {
  headers?: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  statusCode: number;
  body?: string;
}
