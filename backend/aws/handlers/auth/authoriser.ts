import { JwtPayload, verify } from 'jsonwebtoken';

import IHTTP from '../../shared/interfaces/IHTTP';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';

interface IPolicy {
  principalId: string;
  policyDocument: { Version: string; Statement: { Action: string; Effect: string; Resource: string }[] };
}

interface IPayload {
  context: string | JwtPayload;
  principalId: string;
  policyDocument: { Version: string; Statement: { Action: string; Effect: string; Resource: string }[] };
}

const authoriser = async (event: { authorizationToken: string; methodArn: string }): Promise<IPayload | IHTTP> => {
  console.log('🚀 ~ file: authoriser.ts ~ line 17 ~ authoriser ~ event', event);
  if (!event.authorizationToken) throw 'Unauthorised';

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = verify(token, process.env.AUTH0_PUBLIC_KEY!);
    const policy = generatePolicy(claims.sub as string, event.methodArn);

    return {
      ...policy,
      context: claims
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(401, 'Unauthorized');
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export default authoriser;

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
