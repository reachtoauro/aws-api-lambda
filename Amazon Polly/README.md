## Introduction
Build a Serverless Text-To-Speech Application using Amazon Polly

# Coverage
- Amazon DynamoDB to store data
- Amazon API Gateway to create RESTful functions
- AWS Lambda functions triggered from API Gateway
- Connect AWS Lambda functions with Amazon SNS(IAM roles to attach for DynamoDB and SNS Publish)
- Use Amazon Polly to synthesize speech in a variety of language and voices

# DynamoDB
- id
- status - UPDATED or PROCESSING 
- text - post text
- url - link to S3 bucket where the mp3 file is stored
- voice - Amazon Polly voice used to create the file

# S3
- created bucket to store mp3 files

# Lambda Function
- To store text message in DynamoDB and publish to SNS ( Used ENvironment Variables for SNS_TOPIC(ARN) and DB_TABLE_NAME)
- To convert the text to speech using Amazon Polly, upload the mp3 into s3 and update the details in DynamoDB( Environment Variable: DB_TABLE_NAME, BUCKET_NAME) with a trigger attached for SNS Topic(ARN)
- Fetch the result from DynamoDB(Environment Variable: DB_TABLE_NAME)

# API Gateway
- POST 
- GET (with query string `postId`)

# Serverless User Interface
- Can be Served from S3 bucket
- replace `YOUR_API_GATEWAY_ENDPOINT` inside script.js with your s3 bucket name
- bucket policy is here as well for reference `s3-public-bucket-policy.json`

# Amazon Polly
Build Your Own Text-to-Speech Applications with Amazon Polly - https://aws.amazon.com/blogs/machine-learning/build-your-own-text-to-speech-applications-with-amazon-polly/

## Advantage
- Application is completely serverless
- No maintenance or patching needed
- Highly available application as AWS Lambda, API Gateway, S3, and DynamoDB use multiple available zones.