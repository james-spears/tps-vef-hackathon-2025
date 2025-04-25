import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as genai from '@cdklabs/generative-ai-cdk-constructs';
import { FoundationModelIdentifier } from 'aws-cdk-lib/aws-bedrock';

export class TextModelStack extends cdk.Stack {
  textModel: genai.bedrock.BedrockFoundationModel;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.textModel =
      genai.bedrock.BedrockFoundationModel.fromCdkFoundationModelId(
        FoundationModelIdentifier.AMAZON_NOVA_PRO_V1_0,
        {
          supportsAgents: true,
          supportsKnowledgeBase: true,
        }
      );

    new cdk.CfnOutput(this, 'Text Model ARN', {
      value: this.textModel.modelArn,
    });

    new cdk.CfnOutput(this, 'Text Model Id', {
      value: this.textModel.modelId,
    });
  }
}
