import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';

export async function postComment(event: {
  pathParameters: any;
  body: string;
}) {
  const { username, commentText } = JSON.parse(event.body);

  let timestamp: any;
  timestamp = Date.now();
  timestamp = timestamp.toISOString;

  const comment = JSON.stringify({ timestamp, username, commentText });

  try {
    /* logic here:
      Check review for existing comments e.g. check if attribute exists
      if not then store comment as an array of comments (as an attribute)
      otherwise, append comment to array of comments, set comments attribute
      = new array of commens
    */
    const result = null; // stuff that happens
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return createAWSResErr(500, error);
  }
}

export const handler = middy(postComment).use(cors());
