#!/bin/bash 
yum update -y
yum install -y python3
aws s3 cp s3://us-west-2-aws-training/awsu-spl/SPL-TF-200-NWCDVW-1/1.0.2.prod/scripts/vpcapp.zip .
unzip vpcapp.zip
cd vpcapp
pip3 install -r requirements.txt
export DATABASE_HOST=<RDSClusterEndPoint>
export DATABASE_USER=<RDS_DB_USER>
export DATABASE_PASSWORD=<RDS_DB_PASSWORD>
export DATABASE_DB_NAME=myRDSAuroraDB
cd loaddatabase
python3 database_populate.py
cd ..
python3 application.py