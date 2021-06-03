import jwt from 'jsonwebtoken';
import { createAWSResErr } from '../shared/functions/createAWSResErr';

const generatePolicy = (principalId: any, methodArn: string) => {
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
}): Promise<any> => {
  if (!event.authorizationToken) {
    return createAWSResErr(401, 'Unauthorized');
  }

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    // @ts-expect-error
    const claims: any = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims
    };
  } catch (error) {
    return createAWSResErr(401, error);
  }
};
