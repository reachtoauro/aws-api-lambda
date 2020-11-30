## Introduction
To setup a VPC to support a basic 3-tier web application in AWS cloud. The application will be highly available as build on multiple availability zones.

# Steps
- Build VPC (myVPC) with IPv4 CIDR 10.0.0.0/16
- Create public and private subnets
    - PubSubnet1 -> (myVPC) with IPv4 CIDR 10.0.1.0/24 on AZ1
    - PubSubnet2 -> (myVPC) with IPv4 CIDR 10.0.2.0/24 on AZ2
    - PriSubnet1 -> (myVPC) with IPv4 CIDR 10.0.11.0/24 on AZ1
    - PriSubnet2 -> (myVPC) with IPv4 CIDR 10.0.12.0/24 on AZ2
    - PriSubnet3 -> (myVPC) with IPv4 CIDR 10.0.13.0/24 on AZ1
    - PriSubnet4 -> (myVPC) with IPv4 CIDR 10.0.14.0/24 on AZ2
- Create Internet gateway
    - myInternetGateway attached to myVPC
- Create NAT gateway
    - myNATGateway connected to PubSubnet1 (allocate Elastic IP)
- Create Public Routing table and attach to Internet gateway so that it can send traffic to internet
    - PubRouteTable (myVPC)
    - Add Routes 0.0.0.0/0 Target myInternetGateway
    - Associate with PubSubnet1 and PubSubnet2
- Create Private Routing table and associate all private subnets to the NAT gateway
    - PriRouteTable (myVPC)
    - Add Routes 0.0.0.0/0 Target myNATGateway
    - Associate with PriSubnet1,PriSubnet2,PriSubnet3, and PriSubnet4
- Create Security Groups for RDS, EC2 and ALB
    - myVPCALBSG (myVPC) to allow web access
        - Added Inbound rule for all traffic from anywhere
    - myVPCEC2SG (myVPC) to allow ALB to access EC2 instances
        - Added Inbound rule for Custom TCP port 80 for myVPCALBSG
        - Added Inbound rule for Custom TCP port 8443 for myVPCALBSG
    - myVPCRDSSG (myVPC) to allow EC2 instances to access RDS instances
        - Added Inbound rule for MySQL/Aurora on Port 3306 for myVPCEC2SG
- Create RDS database on private subnet
    - Create Database subnet group to deploy RDS instances in your subnets
        - myVPCRDSSubnetGroup (myVPC) in AZ1, AZ2 and subnets PriSubnet3,PriSubnet4 which were created for RDS
    - Create RDS instance 
        - Standard Aurora with MySQL compatibility
        - myVPCRDSCluster with username password of your choice
        - Create an replica(reader) in different AZ
        - Connectivity: myVPC
        - Subnet: myVPCRDSSubnetGroup
        - No public access
        - Security group: myVPCRDSSG
        - Port: 3306
        - Name: myRDSAuroraDB
        - You'll get 1 writer and 1 reader(repica) instance avaialble in 2 different AZ
        - 2 different Endpoints for each of them
- Create EC2 Instance from Launch template
    - Create a Launch Template
        - myVPCEC2LaunchTemplate
        - Network Settings: myVPC 
        - Security Group: myVPCEC2SG
        - Advance: Instace Profile: myInstanceProfile(EC2 profile having S3 access)
        - User data: <code from userdata.sh> and replace all the HOST(Writer DB), USER and PASSWORD 
    - Launch Instance from template
        - Template: myVPCEC2LaunchTemplate
        - Subnet: PriSubnet1(created for EC2)
        - Tag: Name -> MyAppServer1
    - launch another Instance from template
        - Template: myVPCEC2LaunchTemplate
        - Subnet: PriSubnet2(created for EC2)
        - Tag: Name -> MyAppServer2
        - Instance Profile: myInstanceProfile
        - User data: <code from userdata.sh> and replace all the HOST(Reader DB), USER and PASSWORD
- Create a Application Load Balancer (ALB) in the public subnets to access the application from internet
    - Create Application Load Balancer
        - myLoadBalancer
        - VPC: myVPC
        - Availability Zones:
            - AZ1 -> Subnet: PubSubnet1
            - AZ2 -> Subnet: PubSubnet2
        - Security Group: myVPCALBSG
        - Routing -> Target Group: myTargetGroup
            - Port: 8443
            - Instance:  MyAppServer1
            - Instance:  MyAppServer2
        - You'll get a DNS name from the ALB
- Open the DNS name you got from ALB and you should see the application







# NAT or Network Address Translation gateway
to enable instances in a private subnet to connect to the internet or other AWS services. It also blocks inbound traffic from internet.

# Security Group
It is a virtual firewall for instances which controls inbound and outbound traffic. 

# Tidbits
- When you create a VPC you must specify an IPv4 CIDR block for the VPC.
- The block size should be between /16 netmask and /28 netmask
- /16 netmask consist of 65,536 IP addresses and /28 netmask consist of 16 IP Addresses
- CIDR block of VPC and a single subnet can be same when the subnet is in the VPC
- CIDR block of VPC and multiple subnets can be same when the subnet is for the VPC
- If a VPC has more than one subnets the CIDR blocks cannot overlap
- If you have resources in multiple AZ that share one NAT gateway and if NAT AZ is down, all of your resources in other AZ will loose internet
- AZ independent architecture you should have NAT Gateway for all your AZ
- Security Groups work on instance network interface level and not on the subnet. 
- Instances can have their own firewall(Security Group) to control traffic


# IPv4 Address Planner
https://network00.com/NetworkTools/IPv4AddressPlanner/



# Default VPC provided with all AWS accounts
https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html


# Load Balancing
