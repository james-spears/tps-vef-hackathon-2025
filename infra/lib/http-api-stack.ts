import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as genai from '@cdklabs/generative-ai-cdk-constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class HttpApiStack extends cdk.Stack {
  httpApi: apigatewayv2.HttpApi;

  constructor(
    scope: Construct,
    id: string,
    props: {
      textModel?: genai.bedrock.BedrockFoundationModel;
      embeddingModel?: genai.bedrock.BedrockFoundationModel;
    }
  ) {
    super(scope, id);

    this.httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      description: 'Public web API.',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
      },
    });

    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: this.httpApi.url ?? '',
    });

    const environment: Record<string, string> = {};
    let embeddingModelPolicy: iam.PolicyStatement | undefined;
    let textModelPolicy: iam.PolicyStatement | undefined;

    if (props.embeddingModel) {
      embeddingModelPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:*'],
        resources: [props.embeddingModel.modelArn],
      });
      environment.EMBEDDING_MODEL_ID = props.embeddingModel.modelId;
      environment.EMBEDDING_MODEL_ARN = props.embeddingModel.modelArn;
    }

    if (props.textModel) {
      textModelPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['bedrock:*'],
        resources: [props.textModel.modelArn],
      });
      environment.TEXT_MODEL_ID = props.textModel.modelId;
      environment.TEXT_MODEL_ARN = props.textModel.modelArn;
    }

    const autocompleteHandler = new lambda.Function(
      this,
      'AutocompleteHandler',
      {
        code: lambda.Code.fromAsset('../api/dist'),
        functionName: 'autocompleteHandler',
        handler: 'autocomplete.handler',
        memorySize: 128,
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        timeout: cdk.Duration.seconds(100),
        environment,
      }
    );

    if (embeddingModelPolicy) autocompleteHandler.addToRolePolicy(embeddingModelPolicy);
    if (textModelPolicy) autocompleteHandler.addToRolePolicy(textModelPolicy);

    new apigatewayv2.HttpRoute(this, 'AutocompleteRoute', {
      httpApi: this.httpApi,
      routeKey: apigatewayv2.HttpRouteKey.with(
        '/api/v1/autocomplete',
        apigatewayv2.HttpMethod.POST
      ),
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        'AutocompleteHandler',
        autocompleteHandler
      ),
    });

    const queryHandler = new lambda.Function(this, 'QueryHandler', {
      code: lambda.Code.fromAsset('../api/dist'),
      functionName: 'queryHandler',
      handler: 'query.handler',
      memorySize: 128,
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(100),
      environment,
    });

    if (embeddingModelPolicy) queryHandler.addToRolePolicy(embeddingModelPolicy);
    if (textModelPolicy) queryHandler.addToRolePolicy(textModelPolicy);

    new apigatewayv2.HttpRoute(this, 'QueryRoute', {
      httpApi: this.httpApi,
      routeKey: apigatewayv2.HttpRouteKey.with(
        '/api/v1/Query',
        apigatewayv2.HttpMethod.POST
      ),
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        'QueryHandler',
        queryHandler
      ),
    });
  }
}
