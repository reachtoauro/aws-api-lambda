## Introduction
A practical application using triggers that combines DynamoDB and Lambda using kinesis streams.

# Steps
- Create Lambda function using blueprint(kinesis-process-record-python) with Kinesis stream trigger enabled
    - Permission: Cloudwatch Log write and Kinesis List, Read
    - Trigger - Kinesis stream 
- Create Amazon Kinesis stream with 1 shards
- Monitor using Cloudwatch
- Create DynamoDB 2 table:
    - GameScoreRecords
        - Partition Key - RedordID(number)
        - enable stream with View Type - New Image: entire item as it apprears after the update
    - GameScoreByUser
        - Partition Key - Username(string)
- Configure Lambda function to aggregate score by user and choose trigger as Kinesis stream: GameScoreRecords
    - this will be triggered when a new game score is added to the DynamoDB table

# Amazon Kinesis
fully managed service to process real time streaming data with scale. It can process hundreds of terabytes of data per hour from hundreds of thousands of sources. 

# Shards
supports a pre-defined capacity also known as total stream capacity. The number of shards should be determined based on the capacity requirement.

Ref - http://aws.amazon.com/documentation/kinesis/

# Amazon DynamoDB
fast and flexible NoSQL database service which is consistent and highly scalable. 
Ref - https://aws.amazon.com/documentation/dynamodb/

# DynamoDB streams
generates streaming data whenever there is any change to the table(insert, update or delete). 

# Steps
- Enter data into `GameScoreRecords`
    - RecordID - random number
    - Username(string)
    - Score(number)
- it will trigger the aggregate lambda function
