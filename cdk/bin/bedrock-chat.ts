#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BedrockChatStack } from "../lib/bedrock-chat-stack";
import { FrontendWafStack } from "../lib/frontend-waf-stack";

const app = new cdk.App();

const BEDROCK_REGION = app.node.tryGetContext("bedrockRegion");
const ALLOWED_IP_V4_ADDRESS_RANGES: string[] = app.node.tryGetContext(
  "allowedIpV4AddressRanges"
);
const ALLOWED_IP_V6_ADDRESS_RANGES: string[] = app.node.tryGetContext(
  "allowedIpV6AddressRanges"
);

// WAF for frontend
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html
const waf = new FrontendWafStack(app, `FrontendWafStack`, {
  env: {
    region: "us-east-1",
  },
  allowedIpV4AddressRanges: ALLOWED_IP_V4_ADDRESS_RANGES,
  allowedIpV6AddressRanges: ALLOWED_IP_V6_ADDRESS_RANGES,
});

new BedrockChatStack(app, `BedrockChatStack`, {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
  },
  crossRegionReferences: true,
  bedrockRegion: BEDROCK_REGION,
  webAclId: waf.webAclArn.value,
});
