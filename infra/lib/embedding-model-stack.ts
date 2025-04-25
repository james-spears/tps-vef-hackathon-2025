import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as genai from '@cdklabs/generative-ai-cdk-constructs';
import { FoundationModelIdentifier } from 'aws-cdk-lib/aws-bedrock';

export class EmbeddingModelStack extends cdk.Stack {
  embeddingModel: genai.bedrock.BedrockFoundationModel;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.embeddingModel =
      genai.bedrock.BedrockFoundationModel.fromCdkFoundationModelId(
        FoundationModelIdentifier.AMAZON_TITAN_EMBED_TEXT_V2_0,
        {
          supportsAgents: true,
          supportsKnowledgeBase: true,
        }
      );

    new cdk.CfnOutput(this, 'Embedding Model ARN', {
      value: this.embeddingModel.modelArn,
    });

    new cdk.CfnOutput(this, 'Embedding Model Id', {
      value: this.embeddingModel.modelId,
    });
  }
}
