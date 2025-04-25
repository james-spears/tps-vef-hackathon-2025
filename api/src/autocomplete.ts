import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
  RetrieveAndGenerateCommandInput,
} from '@aws-sdk/client-bedrock-agent-runtime';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(event);
  let body: { text: string };
  try {
    body = JSON.parse(event.body ?? '');
  } catch (e) {
    console.error(e);
    return {
      body: JSON.stringify({ msg: 'bad request' }),
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
    };
  }
  // const credentials = {
  //   accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID ?? '',
  //   secretAccessKey: process.env.AWS_BEDROCK_SECRET_KEY_ID ?? '',
  //   // sessionToken: 'sessionToken',
  // };
  const client = new BedrockAgentRuntimeClient({
    region: 'us-east-1',
    // credentials,
  });
  const input: RetrieveAndGenerateCommandInput = {
    input: body,
    retrieveAndGenerateConfiguration: {
      type: 'KNOWLEDGE_BASE',
      knowledgeBaseConfiguration: {
        knowledgeBaseId: process.env.AWS_BEDROCK_KNOWLEDGE_BASE_ID ?? '', // required
        modelArn: process.env.AWS_BEDROCK_TEXT_MODEL_ARN ?? '',
        generationConfiguration: {
          inferenceConfig: { // InferenceConfig
            textInferenceConfig: { // TextInferenceConfig
              temperature: 0.1,
            },
          },
          promptTemplate: {
            textPromptTemplate: `
            Considering only: 

              $search_results$
              
            complete the following query: 
            
              $query$ 
            
            in 10 different ways and be sure to format output in a JSON array:

             '[{ "text": "..." }]'.

            `,
          },
        },
      },
    },
  };
  const command = new RetrieveAndGenerateCommand(input);
  const response = await client.send(command);
  let text = response.output?.text ?? '[]';
  const prefix = '```json';
  const suffix = '```';
  try {
    text = JSON.parse(text);
  } catch (e) {
    if (e instanceof SyntaxError) {
      if (text.includes(prefix)) {
        text = text.substring(text.indexOf(prefix) + prefix.length, text.lastIndexOf(suffix));
      } else {
        text = '[]'
      }
    } else {
      console.error(e);
      throw e;
    }
  }
  return {
    body: text,
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
  };
};
