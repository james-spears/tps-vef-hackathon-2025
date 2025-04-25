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
          promptTemplate: {
            textPromptTemplate: `Considering only $search_results$ Complete the following query in 10 different ways and make certain to format output in a JSON array ex. '[{ "query": "..." }]': $query$`,
          },
        },
      },
    },
  };
  const command = new RetrieveAndGenerateCommand(input);
  const response = await client.send(command);
  const text = response.output?.text;
  // const prefix = '```json';
  // const suffix = '```';
  // .substring(text.indexOf(prefix) + prefix.length, text.lastIndexOf(suffix))
  return {
    body: text ? text : '[]',
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
  };
};

// import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
// import {
//   BedrockRuntimeClient,
//   ConversationRole,
//   ConverseCommand,
//   ConverseCommandInput,
// } from '@aws-sdk/client-bedrock-runtime';

// export const handler = async (
//   event: APIGatewayProxyEventV2
// ): Promise<APIGatewayProxyResultV2> => {
//   console.log(event);
//   let body: { text: string };
//   try {
//     body = JSON.parse(event.body ?? '');
//   } catch (e) {
//     console.error(e);
//     return {
//       body: JSON.stringify({ msg: 'bad request' }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       statusCode: 400,
//     };
//   }
//   // const credentials = {
//   //   accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID ?? '',
//   //   secretAccessKey: process.env.AWS_BEDROCK_SECRET_KEY_ID ?? '',
//   //   // sessionToken: 'sessionToken',
//   // };
//   const client = new BedrockRuntimeClient({
//     region: 'us-east-1',
//     // credentials,
//   });
//   const message = {
//     content: [
//       {
//         text: `Complete the following query in 10 different ways and format output in a JSON array: ${body.text}`,
//       },
//     ],
//     role: ConversationRole.USER,
//   };

//   const input: ConverseCommandInput = {
//     modelId: process.env.AWS_BEDROCK_TEXT_MODEL_ID ?? '',
//     messages: [message],
//     inferenceConfig: {
//       maxTokens: 500, // The maximum response length
//       temperature: 0.5, // Using temperature for randomness control
//       //topP: 0.9,        // Alternative: use topP instead of temperature
//     },
//   };
//   const command = new ConverseCommand(input);
//   const response = await client.send(command);
//   const text = response.output?.message?.content?.[0].text;
//   const prefix = '```json';
//   const suffix = '```';
//   text.substring(text.indexOf(prefix) + prefix.length, text.lastIndexOf(suffix)).trim()
//   return {
//     body: text
//       ? text.substring(text.indexOf(prefix) + prefix.length, text.lastIndexOf(suffix)).trim()
//       : '[]',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     statusCode: 200,
//   };
// };
