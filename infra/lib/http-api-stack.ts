import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';


export class HttpApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      description: 'Public web API.',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
      },
    });

    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url ?? '',
    });

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
      }
    );

    new apigatewayv2.HttpRoute(this, 'AutocompleteRoute', {
      httpApi: httpApi,
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
    });

    new apigatewayv2.HttpRoute(this, 'QueryRoute', {
      httpApi: httpApi,
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
