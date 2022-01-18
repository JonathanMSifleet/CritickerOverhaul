export default interface IHTTPErr {
  headers?: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  statusCode: number;
  statusText: string;
}
