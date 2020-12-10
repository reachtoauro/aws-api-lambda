## Introduction
How Amazon Kinesis Firehose capture streaming data, transform and then send the data to Elasticsearch.

# Steps
- AWS Lambda data transformation function creation
- Kinesis Firehose delivery stream creation
- connecting the delivery stream to Elasticsearch
- sending data to delivery stream
- visualize with kibana

# Flow
- stock quote information data stream
- send to Kinesis Firehose delivery stream
- AWS lambda function to transform the data 
- Collect the data in batches and send them to Elasticsearch service cluster
- Visualize the data in kibana

# Amazon Kinesis Firehose
fully managed service to deliver realtime streaming data to destinations e.g., Amazon S3, Amazon Elasticsearch, Amazon Redshift. Amazon Kinesis Analytics with easily configurable data producer.

Ref - https://www.youtube.com/watch?v=814aUb5n_Fk

# AWS Lambda
No administration compute platform

Ref -https://www.youtube.com/watch?v=eOBq__h4OJ4

# Amazon Elasticsearch 
Elasticsearch is a open source popular search and analytics engine. Amaon Elasticsearch service is a managed service which is easy to deploy, operate and scale Elasticsearch. 

# Kibana
open source data visualization and exploration tool for logging, time series, application monitoring etc. It is popular for powerful histogram, line graphs, pie-chart, heat maps and geospatial features and easy to use configurable dashboards.

# AWS Lambda function
we will trigger the lambda function to trigger from Kinesis Firehose
- receive event which might contain multiple records
- loop through the records
- create new output record by adding timestamp, ticker and price(Transformation)

# Amazon Kinesis Firehose
- Create delivery stream
- Enable Data Transformation
    - select lambda function
- Destination - Amazon Elasticsearch 
    - Domain
    - Index
    - Type
- S3 backup - to store records which will fail
- Configure Elasticsearch buffer conditions
    - Buffer Size
    - Buffer Interval
- Assing a role with permissions - Amazon S3, Amazon Lambda, Amazon Elasticseach service and Amazon Cloudwatch logs

# Amazon Elasticsearch Domains/Cluster
- Stocks


# References
https://aws.amazon.com/documentation/kinesis/
https://www.elastic.co/products/kibana
https://aws.amazon.com/elasticsearch-service/



