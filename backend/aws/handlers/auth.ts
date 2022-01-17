import jwt from 'jsonwebtoken';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

interface IPolicy {
  context?: jwt.JwtPayload;
  principalId: string;
  policyDocument: {
    Version: string;
    Statement: {
      Action: string;
      Effect: string;
      Resource: string;
    }[];
  };
}

const generatePolicy = (principalId: string, methodArn: string): IPolicy => {
  const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard
        }
      ]
    }
  };
};

export const handler = async (event: {
  authorizationToken: string;
  methodArn: string;
}): Promise<IPolicy | IHTTPErr> => {
  if (!event.authorizationToken) return createAWSResErr(401, 'Unauthorized');

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY!);
    const policy = generatePolicy(claims.sub!, event.methodArn);

    return {
      ...policy,
      context: claims
    };
  } catch (error: unknown) {
    if (error instanceof Error) return createAWSResErr(401, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};
