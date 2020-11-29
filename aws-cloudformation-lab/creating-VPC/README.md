## Introduction

Creating Amazon VPC using Cloudformation

# Achievements
- Deploy AWS Clouformation template which will create Amazon VPC
- Update the stack

# Background
Amazon Virtual Private Cloud(VPC) lets you provision a logically isolated section of the AWS cloud where you can have your own resources within a virtual network. You can control everything on this virtual network of yours like selection of your own IP range, subnet creation, routing table configuration, and network gateways.

# v1 template
- VPC
- Intenter gateway - horizontally scaled, redundant and highlt available VPC component that allows communication between instances and the internet
- Public Subnet - connected to the internet via the internet gateway 
- Private Subnet - not connected to the internet gateway
- Routing tables - used to direct/route traffic in/out of subnet
- Subnet Association - route table can be associated with multiple subnets, with each association we need to link them

# Output
- VPC created
- AZ1 availability zone created

## After update with v2
Additional public and private subnets added in another AZ. This is a best practise followed for High Availability so that resources can run in multiple data centres in case of system failure.

# Functions
- !Select - referencing the first from the list
- !GetAZs - retrieve a list of available AZ(Availability Zones) within the region 
- !GetAtt - retrieve an attribute of the resource

# References
CIDR - https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
Functions - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html