## Introduction

# Apigee Edge
The server
# API Proxy
The interface that client calls and which routes to the backend api. It authenticates the user as well.

# Flow Variables
when request comes you can extract the request path parameters or headers from the request those are called Flow variables

# Proxy and Target Endpoint
proxy is the endpoint that user calls and target endpoint is the url for backend.

# API Proxy Flows
- PreFlow - execute first in proxy always
- CondFlow - executes as per condition
- PostFlow - executes always
- PostClientFlow  - once the response sent back to the client maybe for logging

# API Target Flows
- PreFlow - execute first in proxy always
- CondFlow - executes as per condition
- PostFlow - executes always

# API Policy
xml formatted 30+ policies for traffic managaement, security, mediations and extensions. It also custom policies with Javascript, Python programming as well

# Folder structure
-/apiproxy
    -proxy.xml
    -/proxies
        - default.xml
    -/targets
        - default.xml
    -/policies
        - policy1.xml

# Download proxy as code
Develop -> API Proxies -> click on your proxy -> Overview -> Project -> Download revision as zip

# Upload your proxy
Develop -> API Proxies -> New Proxy -> Proxy bundle -> upload zip -> upload and deploy

# API Product
combine your api to a product and then you can get access as an app as developer to have access the api

# Cache policy - Scaling
adding response cache policy for caching in request preflow

# API Environment

# API Proxy - Trace

# API Traffic Management
- Quota
- Spike arrest
- Concurrent rate limit

# Quota Policy
- Distributed and Synchronous
- Unique counters based on query parameter
- Message weight
- Calendar type
- Rolling window type
- Flexi type
- Conditional quota count
- Flow variables
- Error handling

# Spike arrest

# Access control policy
- Basic authentication - encode operation
- Basic authentication - decode operation
- JSON threat protection
- 




