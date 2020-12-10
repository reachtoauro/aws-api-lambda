## Introduction
realtime log analysis to ensure security compliance, troubleshoot operational events, identify application usage patterns etc. Two web servers running ecommerce applications on EC2 instances which are installed with Cloudwatch agents to collect apache access logs and server security logs. Also the cloudwatch is collecting cloudtrail logs as well as VPC flow logs. 

# Amazon Elasticsearch
A managed service which simplifies the deployment, operation and scaling of elasticsearch clusters. Also Kibana as it is integrated with elasticsearch. 

# Steps
- Deploy Amazon Elasticsearch cluster
- Create user profiles using Amazon Cognito user pool
- Setup Lamnda function to pull logs into Amazon Elasticsearch
- Analyze logs in kibana dashboard

# Technologies
- Amazon Elasticsearch Service(ES)
- Kibana
- Amazon Cognito
- AWS Lambda
- AWS CloudWatch
- AWS CloudTrail
- VPC Flow Logs - feature to capture information about IP traffic going to and from network interfaces in your VPC. 
- AWS IAM
- Amazon VPC
- Amzon EC2

# Elasticsearch Cluster creation
- Define how many Availablity Zones(AZ) 
- Instance types
- Storage spaces provided by EBS volume
- Quantity of data instances
- The size
- Number of master instances
- Encryption options

# Amazon ES
- Availability Zones 2 us-west-2a, us-west-2b
- Number of nodes 2
- instance type i3.large.elasticsearch
- encryption at rest - active
- Cognito enabled

# AWS Lambda
- Add environment variable `DOMAIN_ENDPOINT` with value ES VPC endpoint url
- Add your VPC to lambda so that it can access ES cluster as your ES cluster is inside your VPC.
- Memory 512 mb and Timeout 2 mins

# AWS CloudWatch
- Add Lambda subscription filter to your access log group
    - Log format Other
    - Subscription filter pattern `[host, ident, authuser, date, request, status, bytes, referrer, agent]`
- Add Lambda subscription filter to your CloudTrail log group
    - Log format - AWS CloudTrail
- Add Lambda subscription filter to your VPC Flow log group
    - Log format - Amazon VPC Flow logs
- Add Lambda subscription filter to your SSH log group
    - Log format Other
    - Subscription filter pattern `[month, day, timestamp, destIp, id, msg1, msg2, msg3, srcIp, msg5, destPort, msg7]`

# AWS CloudTrail logs

# VPC Flow Logs

# Security Logs

# Kibana
Your ES cluster is inside your VPC so the URL is not public. You can access the URL through a VPN or bastion host that is running inside the same VPC. 
- Advanced kibana dashboard json
- login with your cognito credential
- Management -> Index Pattern 
    - pattern: `cwl-*`
    - Time filter: @timestamp
- Saved Object
    - import the advanced dashboard json
- Dashboard
# Brute force attacks
act of attempting to log in remotely to a server. 
- Filter: @log_group.keyword is AccessLogGroup
- Fields: Host, Status, Request, Agent
- Filter: status not one of 200

Ref - Geo lookup - http://geoiplookup.net/

# SSH attacks
if your ec2 instance is compromised then the hacker can get into rest of your infrastructure to steal information.
- Filter: @logrroup is SSHLogGroup
- Fields: srcIp, destIp, destPost
- Filter: msg1.keyword is Connection (display the connection attempts)

# AWS services under attack
if a hacker is trying to get access to other services like Systems Manager, DynamoDB
- Filter: @log_group is CloudTrailLogGroup 
- Fields: eventSource, eventName, requestParameters, awsRegion, receipientAccountId
- Filter: userAgent is aws-cli
- Filter: eventSource.keyword is ssm.amazonaws.com


