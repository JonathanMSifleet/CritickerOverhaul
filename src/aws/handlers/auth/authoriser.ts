import createAWSResErr from '../../shared/functions/createAWSResErr';
import { verify } from 'jsonwebtoken';
import IHTTP from '../../interfaces/IHTTP';

interface IContext {
  [key: string]: string;
}

type IPolicyDocument = {
  policyDocument: { Version: string; Statement: { Action: string; Effect: string; Resource: string }[] };
};

interface IPolicy {
  principalId: string;
  policyDocument: IPolicyDocument;
}

interface IPayload {
  context: IContext;
  principalId: string;
  policyDocument: IPolicyDocument;
}

export const handler = async (event: { authorizationToken: string; methodArn: string }): Promise<IPayload | IHTTP> => {
  if (!event.authorizationToken) return createAWSResErr(401, 'Unauthorized');

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = verify(token, process.env.AUTH0_PUBLIC_KEY!) as IContext;
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(401, 'Unauthorized');
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const generatePolicy = (principalId: string, methodArn: string): IPolicy => ({
  principalId,
  policyDocument: {
    // @ts-expect-error Version is part of Policy Document interface
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: methodArn.split('/', 2).join('/') + '/*'
      }
    ]
  }
});
