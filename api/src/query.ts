import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(event);
  return {
    body: JSON.stringify({ msg: 'query works' }),
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
  };
};
