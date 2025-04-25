import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudFrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
// import { Redirect, HttpMethod } from 'aws-cdk-lib/aws-cloudfront';
// import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class StaticSiteWithCloudFrontStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: {
      httpApi: apigatewayv2.HttpApi;
    }
  ) {
    super(scope, id);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: 'tps-vef-hackathon-2025-hw03',
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    if (!props.httpApi.url) throw new Error('must supply http api');
    const httpOrigin = new cloudFrontOrigins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split('/', props.httpApi.url ?? '')));

    const distribution = new cloudFront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new cloudFrontOrigins.S3StaticWebsiteOrigin(siteBucket), // Point to the S3 bucket
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // HTTPS only
        cachePolicy: cloudFront.CachePolicy.CACHING_OPTIMIZED, // Use caching
      },
      additionalBehaviors: {
        '/api/*': {
          origin: httpOrigin,
          allowedMethods: cloudFront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudFront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy:
            cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy:
            cloudFront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
    });

    new cdk.CfnOutput(this, 'S3BucketWebsiteURL', {
      value: `http://${siteBucket.bucketWebsiteDomainName}`,
    });

    new cdk.CfnOutput(this, 'CloudFrontWebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
    });

    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [
        s3deploy.Source.asset('../ui/dist/ui/browser'), // Replace with your site directory
      ],
      destinationBucket: siteBucket,
    });
  }
}
