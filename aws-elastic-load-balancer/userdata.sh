#!/bin/sh
yum -y install httpd php
chkconfig httpd on
systemctl start httpd.service
cd /var/www/html
wget <s3 location of php-app-for-testing zip file>
unzip php-app-for-testing.zip