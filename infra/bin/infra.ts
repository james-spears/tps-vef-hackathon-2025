#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSiteWithCloudFrontStack } from '../lib/static-site-with-cloudfront-stack';
import { HttpApiStack } from '../lib/http-api-stack';

const app = new cdk.App();
new StaticSiteWithCloudFrontStack(app, 'StaticSiteWithCloudFrontStack');
new HttpApiStack(app, 'HttpApiStackStack');
