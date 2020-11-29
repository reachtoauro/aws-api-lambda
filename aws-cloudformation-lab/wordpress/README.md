## AWS Cloudformation

I used a preconfigured AWS Cloudformation template that creates an Amazon EC2 instance within a VPC and installs WordPress with a local MySQL database. 

# Explore
- Parameters - are passed to the stack and can be used to customize the creation of resources
- Options - 
    - Tags - artibitary values mainly used for the purpose of cost allocation
    - Permissions - AWS IAM service role to assume
    - Stack policy - resources to protect from unintentional updates
    - Stack creation updates 
        - Rollback on failure
        - Timeout
        - Termination protection
- Template - content of your templare
- Events - major events in creation of stack
- Resources - resources those are part of the stack having Logical ID, Physical ID, Type and Status
    - WebServerSecurityGroup: security group to enable access via port 80(HTTP) and port 22(SSH)
    - VPC: Virtual Private Cloud for resources
    - InternetGateway: gateway to access internet
    - AttachGateway: attach the internet gateway
    - PublicSubnet1: first public subnet
    - PublicSubnet2: second public subnet
    - PublicRouteTable: public routing table
    - PublicRoute: public route for route table
    - PublicSubnet1RouteTableAssociation: associate first subnet to routing table
    - PublicSubnet2RouteTableAssociation: associate second subnet to routing table
    - WebServer: ec2 instance served as WorfPress server
- Mappings - matches a key to a corresponding set of named values
- Outputs - declares output values that you can also import into other stacks e.g., WebsiteURL, EC2IPAddress

# Template Description
- KeyName: name of keypair for SSH access
- InstanceType: ec2 instance type with allowed values
- SSHLocation: IP address range to be allowed to SSH from post 22
- DBName: database name
- DBUser: database user
- DBPassword: database password
- DBRootPassword: root password for database
- VPCCIDR: CIDR block for CIDR
- PublicSubnet1Param: allowed values for public subnet
- PublicSubnet1Param: same as above

# Functions
- !Sub - substitutes variables in an input string with values that you specify
- !FinInMap - returns the value corresponding to keys in a two-level map that is declared in the Mappings section
- !Ref - eturns the value of the specified parameter or resource
- !Base64 - returns the Base64 representation of the input string


# References
https://aws.amazon.com/cloudformation/
- Setting AWS CloudFormation stack options - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-add-tags.html
- Resources - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html
- Prevent updates to stack resources - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html
- Protecting a stack from being deleted - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-protect-stacks.html
- Intrinsic functions - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html

