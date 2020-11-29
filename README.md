## Introduction

A serverless web application using AWS Services e.g., API GAteway, Lambda, DynamoDB, Cognito, S3, Cloudfront, Route 53

## Serverless advantages
Pay as yu use
No infrastructure hurdle
Scalable
Caching
Distributed
Authorization/Authentication
Staging
Monitoring
Validation
Documentation
Super fast time to market

## Serverless disadvantages
cold start - if the traffic is down for longer time
stateless
cannot use any native library
have to use the supported languages only
AWS API gateway has a timeout 
AWS Lambda has maximum exection time

## Security in mind
Unauthorized access
Compromised User data
DDoS attacks
NoSQL injection
Stolen AWS credentials

## Node.js Serverless
Serverless Framework Website: https://serverless.com/
AWS Getting Started Guide (with Serverless Framework): https://serverless.com/framework/docs/providers/aws/guide/quick-start/
Managing AWS Credentials (for using the Serverless Framework): https://serverless.com/framework/docs/providers/aws/guide/credentials/
Serverless Framework on Github: https://github.com/serverless/serverless

`npm install -g serverless`
create a new serverless project `serverless`
change to project directory `cd your-service-name`
setup your serverlss.yml 
`functions:
  hello:
    handler: handler.hello
    # Add the following lines:
    events:
      - http:
          path: hello
          method: post`

deploy `serverless deploy -v`
you can find your url inside `sls deploy`
test `curl -X POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/hello`
invoke function `serverless invoke -f hello -l`
fetch function logs `serverless logs -f hello -t`

remove your service `serverless remove`

## Serverless Application Model
- SAM Github Page: https://github.com/awslabs/serverless-application-model
- Using SAM: https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md
- Deploying Lambda Functions (with SAM and even automated!): http://docs.aws.amazon.com/lambda/latest/dg/deploying-lambda-apps.html

## Testing
using localstack - https://github.com/atlassian/localstack

# Languages Used
- Node.js
- Angular
- JSON

## AWS API Gateway

- API Gateway Overview: https://aws.amazon.com/api-gateway/
- API Gateway Developer Documentation: https://aws.amazon.com/documentation/apigateway/
- API Gateway Costing : https://aws.amazon.com/api-gateway/pricing/
- API Gateway mapping template reference - http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#input-variable-reference

# Achievements

Created API Gateway resources, methods, models
Request validation and request transformation
Response parsing/transformation
Deployment stages
CORS settings
Creating GET, PUT, POST and DELETE methods and reading from Query path
Authorizer(Custom using Lambda basic function & cognito)
Created documentation on swagger
Authentication and restriction on access based on token
Throttiling setting to prevent DDoS attacks


Reference - API Gateway basic auth lambda function - https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html


## AWS Lambda

- AWS Lambda => https://aws.amazon.com/lambda/?nc2=h_m1
- AWS Lambda Developer Documentation: http://docs.aws.amazon.com/lambda/latest/dg/welcome.html
- AWS Lambda pricing: https://aws.amazon.com/lambda/pricing/

# Brief
- Created DynamoDB table and build necessary IAM roles, policies
- Created Lambda functions to interact with DynamoDB table and store, retrieve and delete data
- Created roles and policies to access those Labda functions from API Gateway
- Create set of APIs in API Gateway and public website to retrieve information from DynamoDB via Lambda functions 

# Achievements

created Node.js lambda basic to interact with API Gateway
created Java 8 basic lamnda to interact with API Gateway
created lambda to fetch data from dynamoDB, delete from dynamoDB and store data in dynamoDB
created lambda function to query cognito for userId to pull data from dynamoDB
created lambda function to query cognito for userId to save data with the partition key
created lambda function to query cognito for userId to delete particular user's partition key data
created lambda function to trigger when S3 object is uploaded in bucket


## AWS DynamoDB

- AWS DynamoDB => https://aws.amazon.com/dynamodb/?nc2=h_m1
- AWS DynamoDB Developer Documenation: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html
- AWS DynamoDB pricing: https://aws.amazon.com/dynamodb/pricing/

# Achievements

Created Table with Partition Key, Created items from Console
Created AWS Lambda functions for SAVE(putItem), GET(scan), GET(getItem), DELETE(deleteItem) using AWS-SDK
Saving a user with randomly generated userId as Partition Key
Getting randomly generated principalId from the Custom Auth(AWS Lambda)

## AWS Cognito

- AWS Cognito => https://aws.amazon.com/cognito/?nc2=h_m1
- AWS Cognito User Pools Developer Guide: http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html
- AWS Cognito Pricing - https://aws.amazon.com/cognito/pricing/
- AWS Cognito SDK - https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js
- AWS Cognito Identity Service Provider for Lambda - API documentation here: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html

# Achievements
1. Created User Pool with connected app client
2. Angular Project to register, validate and login user using aws cognito sdk
3. Using cognito for API Gateway authentication GET, POST, DELETE

## AWS S3
- AWS S3 https://aws.amazon.com/s3/?nc2=h_m1
- AWS S3 Developer Guide: http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html
- AWS S3 Permissions: http://docs.aws.amazon.com/AmazonS3/latest/dev/s3-access-control.html
- AWS S3 Static Website Hosting: http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html
- AWS S3 Pricing: https://aws.amazon.com/s3/pricing/

# Achievements
1. created deployable angular app by running command `ng build --prod`
2. hosting angular app as static website from AWS S3
3. enabling logging in our app and storing all the logs in another S3 bucket

## AWS Route 53
- AWS Route 53 => https://aws.amazon.com/route53/?nc2=h_m1
- AWS Route53 Overview: https://aws.amazon.com/route53/
- AWS Route53 Developer Guide: http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html
- AWS Route53 Pricing: https://aws.amazon.com/route53/pricing/
- AWS Route53 - Registering a Domain: http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar.html

# Achievements
Registered a domain 
Hooked with AWS CloudFront distribution


## AWS CloudFront
- AWS CloudFront => https://aws.amazon.com/cloudfront/?nc2=h_m1
- AWS CloudFront Developer Guides: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html
- AWS CloudFront Pricing: https://aws.amazon.com/cloudfront/pricing/

# Achievements
1. created distribution to serve our static page from edge locations
2. created logging bucket to store app logs as well


## Angular app for UI
`npm install` to install all the required dependecies
`npm start` to run the server locally for development
`npm build --prod` to create deployable web application and then you'll find the contents inside build directory

## Coming soon
 AWS SNS - Sent notifications - https://aws.amazon.com/sns/
 AWS SES - Send emails - https://aws.amazon.com/ses/
 AWS SQS - Messaging Queues - https://aws.amazon.com/sqs/
 AWS Step functions - State management - https://aws.amazon.com/step-functions/
 AWS Kinesis - stream data - https://aws.amazon.com/kinesis/
 AWS IAM - access control 
 AWS Clouwatch - logging and scheduling - https://aws.amazon.com/cloudwatch/
 AWS Codebuild - automatic code building - https://aws.amazon.com/codebuild/
 AWS Code pipeline - continous integration & delivery - https://aws.amazon.com/codepipeline
