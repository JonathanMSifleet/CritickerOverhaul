export default interface IHTTP {
  body: string;
  headers?: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  statusCode: number;
}
