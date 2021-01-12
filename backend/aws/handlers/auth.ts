const jwt = require('jsonwebtoken');

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimising costs.
async function generatePolicy(principalId: any, methodArn: string) {
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
}

// authorise token then generate policy and claims
async function verifyToken(event: {
  authorizationToken: string;
  methodArn: string;
}) {
  const token = event.authorizationToken.replace('Bearer ', '');
  const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
  const policy = await generatePolicy(claims.sub, event.methodArn);
  return { policy, claims };
}

export async function handler(
  event: { authorizationToken: string; methodArn: string },
  _context: any
) {
  try {
    if (!event.authorizationToken) {
      throw 'Unauthorized';
    }

    const { policy, claims } = await verifyToken(event);

    return {
      ...policy,
      context: claims
    };
  } catch (error) {
    console.error(error);
    throw 'Unauthorized';
  }
}
