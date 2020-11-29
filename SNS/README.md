## Introduction
Serverless architecture using Amazon Cloudwatch events and Schedules events with AWS Lambda

## Details
- AWS Lambda function with AWS Cloudwatch events to react on creation of a new EC2 instance
- AWS lambda function(Blueprint: lambda-canary) that will monitor a website and create an Cloudwatch alarm and send notification using SNS

## Stack
- AWS Lambda
- AWS Cloudwatch Rule(EC2 -> EC2 instance change notification -> Specific state -> running -> target -> Lambda)
- AWS Cloudwatch Alarm(with metric Lambda -> Accross All functions -> Errors -> Sum for 1 Minute -> Condition Greater or Equals to -> 1)
- AWS Cloudwatch Alarm
- AWS Simple Notification Service(SNS) to send notification

