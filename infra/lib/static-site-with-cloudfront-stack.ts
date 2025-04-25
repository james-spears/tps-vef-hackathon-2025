import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
// import { Redirect, HttpMethod } from 'aws-cdk-lib/aws-cloudfront';
// import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class StaticSiteWithCloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: 'tps-vef-hackathon-2025-hw03',
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3StaticWebsiteOrigin(siteBucket), // Point to the S3 bucket
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // HTTPS only
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED, // Use caching
      },
    });

    new cdk.CfnOutput(this, 'S3BucketWebsiteURL', {
      value: `http://${siteBucket.bucketWebsiteDomainName}`
    });

    new cdk.CfnOutput(this, 'CloudFrontWebsiteURL', {
      value: `https://${distribution.distributionDomainName}`
    });

    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [
        s3deploy.Source.asset('../ui/dist/ui/browser'), // Replace with your site directory
      ],
      destinationBucket: siteBucket,
    });
  }
}