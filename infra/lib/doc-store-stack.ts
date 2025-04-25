import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class DocStoreStack extends cdk.Stack {
  docStore: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.docStore = new s3.Bucket(this, 'KnowledgeBaseBucket');

    new cdk.CfnOutput(this, 'Knowledge Base Doc Bucket ARN', {
      value: this.docStore.bucketArn,
    });

    new cdk.CfnOutput(this, 'Knowledge Base Doc Bucket Id', {
      value: this.docStore.bucketName,
    });
  }
}
