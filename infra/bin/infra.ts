#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSiteWithCloudFrontStack } from '../lib/static-site-with-cloudfront-stack';
import { HttpApiStack } from '../lib/http-api-stack';
import { TextModelStack } from '../lib/text-model-stack';
import { EmbeddingModelStack } from '../lib/embedding-model-stack';
import { DocStoreStack } from '../lib/doc-store-stack';


const app = new cdk.App();
const { textModel } = new TextModelStack(app, 'TextModelStack');
const { embeddingModel } = new EmbeddingModelStack(app, 'EmbeddingModel');
new DocStoreStack(app, 'DocStoreStack');
const { httpApi } = new HttpApiStack(app, 'HttpApiStackStack', {
  textModel,
  embeddingModel,
});
new StaticSiteWithCloudFrontStack(app, 'StaticSiteWithCloudFrontStack', {
  httpApi,
});
