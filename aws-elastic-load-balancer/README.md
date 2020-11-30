## Introduction
Two webservers in different AZs will be connected using Network Elastic Load Balancer(ELB). It is a single point of contacts for clients. The load balancer distributes incoming traffic to multiple instances to increase your application availability.

44.235.1.59
52.33.152.139
myELB-6570faf36559e4af.elb.us-west-2.amazonaws.com

# Scenarios
- Basic connectivity
- Cross-Zone load balancing Enable/Disable
- During failure of one
- After recovery

# Steps
- Network Load Balancer
- myVPC
- Multiple AZ
- Security Settings
- Routing - Target Group - register targets (add your instances)
- You'll get a DNS name for your ELB

# Health Check
Load balancer sends requests to registered targets using the port and protocol as described
- interval 
- protocol
- port
- ping path
- response timeout

# Target Group status can be
- Initial
- Healthy
- Unhealthy
- Unused
- Draining


# Elastic Load Balancer(ELB)
service that automatically distributes traffic across multiple Amazon EC2 instances. 
- 4th Layer of OSI model
- it can hanlde millions of requests per second
- it selects a target from target group for the rule and opens a TCP connection with the target 
- Great Fault Tolerance (FT)
- Seamless load balancing capacity in response to incoming traffic
- Auto detection of unhealthy instances in the pool and rerouting traffic to healthy ones
- Switching back to normal flow again once the unhealthy instance becomes healthy
- It can be used in Amazon VPC to distribute traffic between application tiers
- Network ELB cross-zone load balancing(distributes traffic evenly to all targets) is disabled by default

# References
How Load balancing works - https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html

Cross-Zone load balancing - https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing

Network Load Balancing - https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html
