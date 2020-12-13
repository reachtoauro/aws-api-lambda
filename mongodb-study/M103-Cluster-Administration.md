## Introduction

## M103: Basic Cluster Administration

# Chapter 1: Introduction and Setup

# Chapter 2: The mongod
- default port `27017`
- default dbpath - `/data/db`
- default bind - localhost
- default auth - disabled

Launch `mongod`
Connect to the Mongo shell in the second shell: `mongo`
To create a new collection `db.createCollection("employees")`
Try to connect back to Mongo shell, without specifying a port: 
`use admin \ db.shutdownServer() \ exit `

`mongod --help`
dbpath - `mongod --dbpath <directory path>`
port - `mongod --port <port number>`
auth - `mongod --auth`
bind ip - `mongod --bind_ip 123.123.123.123`
multiple ip bind - `mongod --bind_ip localhost,123.123.123.123`
- replSet - start in replication mode
- keyFile - 
- sslPEMKey - for transport encryption
- sslCAKey - for transport encryption
- sslMode - for transport encryption
- fork - to un mongod run as a daemon instead

# mongoDB configuration file
- --dbpath -- storage.dbPath
- --logpath -- systemLog.path and systemLog.destination
- --bind_ip -- net.bind_ip
- --replSet -- replication.replSetName
- --keyFile -- security.keyFile
- --sslPEMKey -- net.ssl.sslPEMKey
- --sslCAKey -- net.ssl.sslCAKey
- --sslMode -- net.sslMode
- --fork -- processManagement.fork

Launch mongod with specified --dbpath and --logpath:
`mongod --dbpath /data/db --logpath /data/log/mongod.log`

Launch mongod and fork the process:
`mongod --dbpath /data/db --logpath /data/log/mongod.log --fork`

-- all "ssl" options have been edited to use "tls" instead. As of MongoDB 4.2, options using "ssl" have been deprecated.
`mongod --dbpath /data/db --logpath /data/log/mongod.log --fork --replSet "M103" --keyFile /data/keyfile --bind_ip "127.0.0.1,192.168.103.100" --tlsMode requireTLS --tlsCAFile "/etc/tls/TLSCA.pem" --tlsCertificateKeyFile "/etc/tls/tls.pem"`

sample config file
```storage:
  dbPath: "/data/db"
systemLog:
  path: "/data/log/mongod.log"
  destination: "file"
replication:
  replSetName: M103
net:
  bindIp : "127.0.0.1,192.168.103.100"
tls:
  mode: "requireTLS"
  certificateKeyFile: "/etc/tls/tls.pem"
  CAFile: "/etc/tls/TLSCA.pem"
security:
  keyFile: "/data/keyfile"
processManagement:
  fork: true
```
- `mongod --config "/etc/mongod.conf"`
- `mongod --f "/etc/mongod.conf"`

Ref - 
https://docs.mongodb.com/manual/reference/program/mongod/#options
https://docs.mongodb.com/manual/reference/configuration-options

- run on port 27000
```
net:
   port: 27000
```

- authentication is enabled
```
security:
   authorization: enabled
```

- create admin user
```
mongo admin --host localhost:27000 --eval '
  db.createUser({
    user: "m103-admin",
    pwd: "m103-pass",
    roles: [
      {role: "root", db: "admin"}
    ]
  })
'
```

# File structure

FTDC(Full Time Data Capture) Data source - capture metrics used for diagnostic purpose for support
Journal file - WiredTiger journaling system
- write operation are buffered in memory
- refreshed every 60 seconds, creating a checkpoint of data
- WiredTiger uses a write ahead logging system to a on disk jouranl file
- journal entries are first buffered in memory and then
- WiredTiger syncs the journal to disk every 100 milliseconds. 
- each journal file is limited to 100 MegaBytes of size
- WiredTiger uses a file rotation method to sync data to disc
- in the event of failure, WiredTiger can use journal to recover data that occured between checkpoints
- during normal operation, WiredTiger flushes data to disk every 60 seconds
- or when the journal file has 2 Gigabytes of data
- the flushes creates durable checkpoint

- mongodb-<port>.sock - it us used by mongodb for inter process communication for socket

List --dbpath directory:
`ls -l /data/db`

List diagnostics data directory:
`ls -l /data/db/diagnostic.data`

List journal directory:
`ls -l /data/db/journal`

List socket file:
`ls /tmp/mongodb-27017.sock`

# Lab: Change the Default DB Path
`mkdir -p /var/mongodb/db`

runs on port 27000
stores its data files in /var/mongodb/db/
listens to connections from localhost
uses authentication
```
storage:
  dbPath: /var/mongodb/db
net:
  bindIp: localhost
  port: 27000
security:
  authorization: enabled
```
create user

```
mongo admin --host localhost:27000 --eval '
  db.createUser({
    user: "m103-admin",
    pwd: "m103-pass",
    roles: [
      {role: "root", db: "admin"}
    ]
  })
'
```

# Basic Commands

shell helpers:
- db.<method>() : mehods wraps commands that interact with database
    - db.<collection>.<method>() : for collection level operation
- rs.<method>() : methods that controls replica set deployments and management 
- sh.<method>() : methods that helps with sharded cluster deployment and management

User management commands:
`db.createUser()` - create user
`db.dropUser()` - deletes user

Collection management commands:
`db.<collection>.renameCollection()` - change the name of a colleciton
`db.<collection>.createIndex()` - creatig index
`db.<collection>.drop()` - drop colleciton

Database commands:
`db.runCommand({ <command> })`
`db.commandHelp({ <command> })`

Database management commands:
`db.dropDatabase()` - drop database
`db.createCollection()` - create collection

Database status command:
`db.serverStatus()` - return stats of database

Creating index with Database Command:
```
db.runCommand(
  { "createIndexes": <collection> },
  { "indexes": [
    {
      "key": { "product": 1 }
    },
    { "name": "name_index" }
    ]
  }
)
```

Creating index with Shell Helper:
```
db.<collection>.createIndex(
  { "product": 1 },
  { "name": "name_index" }
)
```
Introspect a Shell Helper:
`db.<collection>.createIndex`


Ref - https://docs.mongodb.com/manual/reference/explain-results/#explain.queryPlanner.optimizedPipeline

## Logging
- ACCESS - access control, authentication
- COMMAND - database commands
- CONTROL - control activities like initialization
- FTDC - diagonostic data collection
- GEO - passing geospatial shapes
- INDEX - indexing operation
- NETWORK - network activities like accepting connections
- QUERY - queries like planner activity
- REPL - replica sets like initial sync and heartbeat
- REPL_HB - replica sets heartbeats
- ROLLBACK - rollback operation
- SHARDING - sharding operation
- JOURNAL - journaling
- WRITE - write operations like update

Get the logging components:

`db.getLogComponents()` - retrieve log components

# Log Levels: 1-5

# Verbosity:
- higher number means more verbose
 -1 : inherit from parent
 0  : default, include information only message
 1-5: increase to include debug messages

# Severity level:
F - Fatal
E - Error
W - Warning
I - Informational (verbosity level 0)
D - Debug(Verbosity level 1-5)

to see log components:
`db.getLogComponents()`

Change the logging level for index logging:
`db.setLogLevel(0, "index")`

View the logs through the Mongo shell:
`db.adminCommand({ "getLog": "global" })`

View the logs through the command line:
`tail -f /data/db/mongod.log`

Update a document:
`db.products.update( { "sku" : 6902667 }, { $set : { "salePrice" : 39.99} } )`

Look for instructions in the log file with grep:
`grep -i 'update' /data/db/mongod.log`

Ref - https://docs.mongodb.com/manual/release-notes/4.2/#logging-and-diagnostics

## Database Profiling
Profiler capture logging data on:
- CRUD
- Administrative operation
- Configuration operation

Profiler Level:
- 0: profiler is off and not collect any data. This is default level
- 1: profiler collects data on operations that takes longer than the value of `slowms`.
- 2: the profiler collects data for all operation


To list all of the collection names you can run this command:
`db.runCommand({listCollections: 1})`

Get profiling level:
`db.getProfilingLevel()`

Set profiling level: mongodb will create a collection for it called `system.profile`
`db.setProfilingLevel(1)`

Show collections:
`db.getCollectionNames()`

Set slowms to 0:
`db.setProfilingLevel( 1, { slowms: 0 } )`

Insert one document into a new collection:
`db.new_collection.insert( { "a": 1 } )`

Get profiling data from system.profile:
`db.system.profile.find().pretty()`

# Lab: Logging to a Different Facility
mongod sends logs to /var/mongodb/logs/mongod.log
```
systemLog:
  path: "/var/mongodb/logs/mongod.log"
  destination: "file"
```
mongod is forked and run as a daemon 
```
processManagement:
   fork: true
```

## Basic Security 
- Authentication : verifies the identity of user to answer who you are?
    - SCRAM - Salted Challenge Response Authentication Mechanism (default, basic password security)
    - X.509 - certificate for authentication(community version)
    - LDAP - Light-weight Directory Access Protocol (enterprise)
    - KERBEROS - 
    - Inter-Cluster Authentication
- Authorization : verifies the privileges of a user to answer what do you have access to?
    - Role based access control: high level of responsibility isolation for operational tasks
        - each user has one or more `Roles`
        - each Role has one or more `Privileges`
        - A Privilege represents a group of `Actions` and the `Resources` those actions applies to

    - Database Administrator - Create User, Create Index
    - Develper - Write data, Read data
    - Data Scienctist - Read data

Print configuration file:
`cat /etc/mongod.conf`

Launch standalone mongod:
`mongod -f /etc/mongod.conf`

Connect to mongod:
`mongo --host 127.0.0.1:27017`

Create new user with the root role (also, named root):
```
use admin
db.createUser({
  user: "root",
  pwd: "root123",
  roles : [ "root" ]
})
```

Connect to mongod and authenticate as root:
`mongo --username root --password root123 --authenticationDatabase admin`

Run DB stats:
`db.stats()`

Shutdown the server:
```
use admin
db.shutdownServer()
```

Security course - https://university.mongodb.com/courses/M310/about

## Built-in Roles
Pre-packaged MongoDB roles

# Role Structure
- Set of privileges
    - Actions -> Resources
- Role can inherit roles as well
- Network Authentication Restrictions
    - clientSource - from a source
    - serverAddress - to a destination

Resources:
- Database
    - specific database and collection `{ db : "products", collection: "inventory" }`
    - all database and all collections `{ db : "", collection: "" }`
- Collection
    - any database and specific collection `{ db : "", collection: "accounts" }`
    - specific database and any collection `{ db : "products", collection: "" }`
- Set of collection
- Cluster `{ cluster: true }`
    - Replica Set
    - Shard Cluster

Privileges:
- Resource
- Actions allowed over resource
    - allow to shutdown over the cluster `{ resource : { cluster: true }, actions: [ "shutdown" ] }`

Build-in Roles
- Specific Database:
    - Database User : read, readWrite
    - Database Administrator : dbAdmin, userAdmin, dbOwner
    - Cluster Administrator : clusterAdmin, clusterManager, clusterMonitor, hostManager
    - Backup/Restore : backup, restore
    - Super User : root
- All Databases:
    - Database User : readAnyDatabase, readWriteAnyDatabase
    - Database Administrator : dbAdminAnyDatabase, userAdminAnyDatabase
    - Super User : root

Authenticate as root user:
`mongo admin -u root -p root123`

Create security officer:
```
db.createUser(
  { user: "security_officer",
    pwd: "h3ll0th3r3",
    roles: [ { db: "admin", role: "userAdmin" } ]
  }
)
```

Create database administrator:
```
db.createUser(
  { user: "dba",
    pwd: "c1lynd3rs",
    roles: [ { db: "admin", role: "dbAdmin" } ]
  }
)
```

Grant role to user:
`db.grantRolesToUser( "dba",  [ { db: "playground", role: "dbOwner"  } ] )`

Show role privileges:
`db.runCommand( { rolesInfo: { role: "dbOwner", db: "playground" }, showPrivileges: true} )`

userAdmin role has:
- changeCustomData
- changePassword
- createRole
- createUser
- dropRole
- dropUser
- grantRole
- revokeRole
- setAuthenticationRestriction
- viewRole
- viewUser

# Lab: Creating First Application User
1. Connect to a mongod
`mongo admin -u m103-admin -p m103-pass --authenticationDatabase admin --port 27000`
2. Use the db.createUser() command to create a user for a CRUD application.
```
db.createUser(
  { user: "m103-application-user",
    pwd: "m103-application-pass",
    roles: [ { db: "applicationData", role: "readWrite" } ]
  }
)
```

# Server Tools Overview
List mongodb binaries list all the tools:
`find /usr/bin/ -name "mongo*"`

Create new dbpath and launch mongod:
`mkdir -p ~/first_mongod`
`mongod --port 30000 --dbpath ~/first_mongod --logpath ~/first_mongod/mongodb.log --fork`

Use mongostat to get stats on a running mongod process:
`mongostat --help`
`mongostat --port 30000`

Use mongodump to get a BSON dump of a MongoDB collection:
```
mongodump --help
mongodump --port 30000 --db applicationData --collection products
ls dump/applicationData/
cat dump/applicationData/products.metadata.json
```

Use mongorestore to restore a MongoDB collection from a BSON dump:
`mongorestore --drop --port 30000 dump/`

Use mongoexport to export a MongoDB collection to JSON or CSV (or stdout!):
```
mongoexport --help
mongoexport --port 30000 --db applicationData --collection products
mongoexport --port 30000 --db applicationData --collection products -o products.json
```

Tail the exported JSON file:
`tail products.json`

Use mongoimport to create a MongoDB collection from a JSON or CSV file:
`mongoimport --port 30000 products.json`

# Lab: Importing a Dataset
Run a mongoimport command on a MongoDB instance running in the background.

The requirements for this command are:

connect to a mongod process running on port 27000
import the data from /dataset/products.json
import the data to applicationData.products
use m103-application-user to authenticate to the database - this user has already been created for you on the admin database with password m103-application-pass

`mongoimport -u m103-application-user -p m103-application-pass --authenticationDatabase admin --port 27000 --db applicationData --collection products /dataset/products.json`

## Chanpter 2: Replication
MongoDB uses asynchrpnous statement based replication and it is platform independent

Replication - concept of maintaining multiple copies of data assuming all servers will not always avaiable, to have better availability

Availability - 

Replica Set - in MongoDb group of nodes which holds same data
  - one primary and multiple secondary nodes
  - secondaries sync with primary in async mode
  - all nodes needs to be stay consistent
  - if anything happens with primary, one of the secondary node will take over i.e., failover
  - `Election` by which process mongoDB determines which secondary will become primary
  - one the node is backup and becomes current with all the sync it'll automatically rejoins the Replica Set
  - `Availability` and `Redundency` of data are properties for durable database solutions

Data Replication:
- Binary Replication:
  - after each write, it examines the bytes change in data file and record those changes in binary log
  - secondary nodes receives those binary logs and write those binary changes to the exact location
  - it is easy, fast
  - deal with less data as it is binary
  - operating systems, server infrastructure, database server version needs to be always same
- Statement Based Replication:
  - after a write is completed in primary node, the write statement is stored in `Oplog`
  - secondaries then sync their Oplogs with primary's Oplogs, and replay the statements on their data
  - it is independent of O/S, infra, version
  - MongoDB uses statement based replication
  - Write commands goes through some transformation before going to Oplog
  - `idempotence` - the statements from Oplog should be in a way that it can be applied indefinite number of times and resulting in same data state 
  - it stores the updated based on what is the current state of data after the write instead of having the actual query
  - Oplog is bigger

# MongoDB Replication
Roles:
- Primary
- Secondary
- Arbiter
  - holds no data
  - can vote in election
  - can never become primary
- Hidden
  - Read only nodes
  - copies of data which is hidden from application
- Delayed
  - hidden nodes can also be set to as delayed node
  - it brings resiliency to application level corruption, without allowing cold backup files for an uncertain event
  - you can set a delay and recover from there within that delay timeframe to recover
  - it is like hot backups

Protocol : 
  PV1: Protocol Version 1 - Raft Protocol
  PV0: Protocol Version 0 - previously used in earlier versions

OpLogs(operations logs): 

- Max Nodes can be 50
- Maximum 7 nodes can be voting numbers

Read more about the `Simple Raft Protocol` http://thesecretlivesofdata.com/raft/
and the `Raft Consensus Algorithm` https://raft.github.io/

# Setup Replica Set
keyFile - enables keyfile authentication, all members of Replica Set have to authenticate with each other using the keyFile
replication -> replicaSetName : 



node1.conf
```
storage:
  dbPath: /var/mongodb/db/node1
net:
  bindIp: 192.168.103.100,localhost
  port: 27011
security:
  authorization: enabled
  keyFile: /var/mongodb/pki/m103-keyfile
systemLog:
  destination: file
  path: /var/mongodb/db/node1/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-example
```

Creating the keyfile and setting permissions on it:
```
sudo mkdir -p /var/mongodb/pki/
sudo chown vagrant:vagrant /var/mongodb/pki/
openssl rand -base64 741 > /var/mongodb/pki/m103-keyfile
chmod 400 /var/mongodb/pki/m103-keyfile
```

Creating the dbpath for node1:
`mkdir -p /var/mongodb/db/node1`

Starting a mongod with node1.conf:
`mongod -f node1.conf`

Copying node1.conf to node2.conf and node3.conf:
`cp node1.conf node2.conf`
`cp node2.conf node3.conf`

node2.conf, after changing the dbpath, port, and logpath:
```
storage:
  dbPath: /var/mongodb/db/node2
net:
  bindIp: 192.168.103.100,localhost
  port: 27012
security:
  keyFile: /var/mongodb/pki/m103-keyfile
systemLog:
  destination: file
  path: /var/mongodb/db/node2/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-example
```

node3.conf, after changing the dbpath, port, and logpath:
```
storage:
  dbPath: /var/mongodb/db/node3
net:
  bindIp: 192.168.103.100,localhost
  port: 27013
security:
  keyFile: /var/mongodb/pki/m103-keyfile
systemLog:
  destination: file
  path: /var/mongodb/db/node3/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-example
```

Creating the data directories for node2 and node3:
`mkdir /var/mongodb/db/{node2,node3}`

Starting mongod processes with node2.conf and node3.conf:
`mongod -f node2.conf`
`mongod -f node3.conf`

Connecting to node1:
`mongo --port 27011`

Initiating the replica set:
`rs.initiate()`

Creating a user:
```
use admin
db.createUser({
  user: "m103-admin",
  pwd: "m103-pass",
  roles: [
    {role: "root", db: "admin"}
  ]
})
```

Exiting out of the Mongo shell and connecting to the entire replica set:
```
exit
mongo --host "m103-example/192.168.103.100:27011" -u "m103-admin"
-p "m103-pass" --authenticationDatabase "admin"
```

Getting replica set status:
`rs.status()`

Adding other members to replica set:
`rs.add("m103:27012")`
`rs.add("m103:27013")`

Getting an overview of the replica set topology:
`rs.isMaster()`

Stepping down the current primary:
`rs.stepDown()`

Checking replica set overview after election:
`rs.isMaster()`

read more - http://www.lagmonster.org/docs/vi.html

# Lab: Deploy a Replica Set
1. 
```
security:
  keyFile: /var/mongodb/pki/m103-keyfile
replication:
  replSetName: m103-repl
```
2. `mongod -f mongod_1.conf`
3. 
`mongo --port 27001`
`rs.initiate()`
4. `use admin`
```
db.createUser({
  user: "m103-admin",
  pwd: "m103-pass",
  roles: [
    {role: "root", db: "admin"}
  ]
})
```
5. 
`mongod -f mongod_2.conf`
`mongod -f mongod_3.conf`

6. 
`mongo -u m103-admin -p m103-pass --port 27001 --host "m103-repl/localhost:27001"`
`rs.add("localhost:27002")`
`rs.add("localhost:27003")`

7. `rs.status()`
`rs.isMaster()`

# Replication Configuration
- JSON object defined configuration options for Replica Set
- can be configured manuall from shell
- Shell replication helper methods:
  - rs.add
  - rs.initiate
  - rs.remove
  - rs.reconfig
  - rs.config

- replicaSetName
`mongod --replSet <replicaSetName>`
- repliaction -> replicaSetName: <replicaSetName>

replica set config:
- _id : <replicaSetName>
- version: increment with changes
- members
  - _id: <int unique identifier>,
  - host: <host and port number>,
  - arbiterOnly: <boolean default false>,
  - hidden: <boolean default false>,
  - priority: <number between 0 to 1000>
    - 0: node cannot become primary
    - changing priority of node will cause election
    - higher priority members will be increased chance of becoming primary
    - arbiterOnly node priority needs to be 0
    - hidden node priority must be 0
  - slaveDelay: <int repliaction delay interval in seconds, default 0>

# Replication commands
`rs.status()` - reports health on replica set node, it uses data from heartbeat
`rs.isMaster()` - role of the node's role in the replica set, shorter output than status
`db.serverStatus()['repl']` - similar to isMaster exception `rbid` - count the number of rollback happened on this node
`rs.printReplicationInfo()` - returns oplog data relative to current node, gives timestamps for first and last oplog events

# Local DB
`oplog.rs` collection inside `local` db in a Replica Set is central point of replication mechanism
- it is all oplog collection that will keep track of all statements are being replicated in replica set
- oplogs collection is capped which means it is capped to a certain size

you can set oplog size in configuration:
`replication -> oplogSizeMg: 5MB`

Make a data directory and launch a mongod process for a standalone node:
```
mkdir allbymyselfdb
mongod --dbpath allbymyselfdb
```

Display all databases (by default, only admin and local):
```
mongo
show dbs
```

Display collections from the local database (this displays more collections from a replica set than from a standalone node):
```
use local
show collections
```

Query the oplog after connected to a replica set:
```
use local
db.oplog.rs.find()
```

Get information about the oplog (remember the oplog is a capped collection).
Store oplog stats as a variable called stats:
`var stats = db.oplog.rs.stats()`

Verify that this collection is capped (it will grow to a pre-configured size before it starts to overwrite the oldest entries with newer ones):
`stats.capped`

Get current size of the oplog:
`stats.size`

Get size limit of the oplog:
`stats.maxSize`

Get current oplog data (including first and last event times, and configured oplog size):
`rs.printReplicationInfo()`

Create new namespace m103.messages:
```
use m103
db.createCollection('messages')
```

Query the oplog, filtering out the heartbeats ("periodic noop") and only returning the latest entry:
```
use local
db.oplog.rs.find( { "o.msg": { $ne: "periodic noop" } } ).sort( { $natural: -1 } ).limit(1).pretty()
```

Insert 100 different documents:
```
use m103
for ( i=0; i< 100; i++) { db.messages.insert( { 'msg': 'not yet', _id: i } ) }
db.messages.count()
```

Query the oplog to find all operations related to m103.messages:
```
use local
db.oplog.rs.find({"ns": "m103.messages"}).sort({$natural: -1})
```

Illustrate that one update statement may generate many entries in the oplog:
```
use m103
db.messages.updateMany( {}, { $set: { author: 'norberto' } } )
use local
db.oplog.rs.find( { "ns": "m103.messages" } ).sort( { $natural: -1 } )
```

Remember, even though you can write data to the local db, you should not.

# Reconfiguring a Running Replica Set


node4.conf
```
storage:
  dbPath: /var/mongodb/db/node4
net:
  bindIp: 192.168.103.100,localhost
  port: 27014
systemLog:
  destination: file
  path: /var/mongodb/db/node4/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-example
```

arbiter.conf:
```
storage:
  dbPath: /var/mongodb/db/arbiter
net:
  bindIp: 192.168.103.100,localhost
  port: 28000
systemLog:
  destination: file
  path: /var/mongodb/db/arbiter/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-example
```

Starting up mongod processes for our fourth node and arbiter:
```
mongod -f node4.conf
mongod -f arbiter.conf
```

From the Mongo shell of the replica set, adding the new secondary and the new arbiter:
```
rs.add("m103:27014")
rs.addArb("m103:28000")
```

Checking replica set makeup after adding two new nodes:
`rs.isMaster()`

Removing the arbiter from our replica set:
`rs.remove("m103:28000")`

Assigning the current configuration to a shell variable we can edit, in order to reconfigure the replica set:
`cfg = rs.conf()`

Editing our new variable cfg to change topology - specifically, by modifying cfg.members:
```
cfg.members[3].votes = 0
cfg.members[3].hidden = true
cfg.members[3].priority = 0
```

Updating our replica set to use the new configuration cfg:
`rs.reconfig(cfg)`

# Lab: Reconfigure a Replica Set
1. Connect to the replica set
`mongo --host m103-repl/localhost:27004 -u m103-admin -p m103-pass`
2. Store this configuration and in a variable and use this variable to update the following fields 
`cfg = rs.conf()`
3. Reconfigure the replica set using your new configuration document.
`cfg.members[3].votes = 0`
`cfg.members[3].hidden = true`
`cfg.members[3].priority = 0`
`rs.reconfig(cfg)`

# Reads and Writes on a Replica Set


Connecting to the replica set:
`mongo --host "m103-example/m103:27011" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"`

Checking replica set topology:
`rs.isMaster()`

Inserting one document into a new collection:
```
use newDB
db.new_collection.insert( { "student": "Matt Javaly", "grade": "A+" } )
```

Connecting directly to a secondary node (this node may not be a secondary in your replica set!)
`mongo --host "m103:27012" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"`

Attempting to execute a read command on a secondary node (this should fail):
`show dbs`

Enabling read commands on a secondary node:
`rs.slaveOk()`
- you can only enable read in secondary nodes

Reading from a secondary node:
`use newDB`
`db.new_collection.find()`

Attempting to write data directly to a secondary node (this should fail, because we cannot write data directly to a secondary):
`db.new_collection.insert( { "student": "Norberto Leite", "grade": "B+" } )`

Shutting down the server (on both secondary nodes)
`use admin`
`db.shutdownServer()`

Connecting directly to the last healthy node in our set:
`mongo --host "m103:27011" -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"`

Verifying that the last node stepped down to become a secondary when a majority of nodes in the set were not available:
`rs.isMaster()`

# Failover and Elections
Rolling upgrade - upgrading one server at a time starting with secondary node

Storing replica set configuration as a variable cfg:
`cfg = rs.conf()`

Setting the priority of a node to 0, so it cannot become primary (making the node "passive"):
`cfg.members[2].priority = 0`

Updating our replica set to use the new configuration cfg:
`rs.reconfig(cfg)`

Checking the new topology of our set:
`rs.isMaster()`

Forcing an election in this replica set (although in this case, we rigged the election so only one node could become primary):
`rs.stepDown()`

Checking the topology of our set after the election:
`rs.isMaster()`

# Write Concerns
an acknowledgement mechanism that developers can add to write operations 
- highers levels of acknowledgements produce a stronger durability gurantee
- durability means that the write has propagated to the number of replica set member nodes specified in the write concern
- the more number of replica set member nodes acknowledges a success of a write the more likely the write is durable in the event of a failure

`{ w: <value>, j: <boolean>, wtimeout: <number> }`

Write concern levels:
- 0: don't wait for acknowledgement
- 1: default, wait for acknowledgement on the primary only
- >=2: wait for acknowledgement on the primary and one or more secondary 
- majority: wait for acknowledgement from the majority of replica set members

Write concerns Options:
- wtimeout: <int> - the time to wait for the requested write concern before making the operation as failed
- j: <true|false> - requires the node to commit the write operation to the journal before returning an acknowledgement

write concern commands:
- insert
- update
- delete
- findAndModify

# Lab - Writes with Failovers

# Read Concerns
an acknowledgement mechanism for read operations where developers can direct their application to perform read operation where the returned documents meets the requested durability gurantee
`readConcern: { level: <level> }`
`db.collection.find().readConcern(<level>)`
`db.products.find({ "name" :"things", ...}).readConcern( level: "majority")`

Read concern levels:
- local: returns data from the instance with no guarantee that the data has been written to a majority of the replica set members
- available: sharded clusters
- majority: returns the data that has been acknowledged by a majority of the replica set members
- linearizable: returns data that reflects all successful majority-acknowledged writes that completed prior to the start of the read operation
- snapshot: 

Read Preferences
driver preference setting
`db.product.find( "name" : "anything", ...).readPref("secondaryPreferred)`

Supported read preference modes:
- primary: default, routes all read reference to primary only
- primaryPreffered: mainly primary if aavailable, if not available it reads from secondary instead
- secondary: only from secondary
- secondaryPreferred: mainly secondary if aavailable, if not available it reads from primary instead
- nearest: least network latecy to the host regardless of member type, geographically local read

## Chapter 3: Sharding
distributing data by dividing them in pieces and distribute them in `shards` as many as we want, together they make up sharded cluster, in order to gurantee high availability deploy each shard as `replica set` to ensure fault tolerance. 

`mongos` - routes the query to correct shards
- client connects to mongos to handle requests for all sharded cluster
- it gets `metadata` about the each data contained in each shard
- the metadata stored in config servers which is highly available by using replication

# when to shard
indicators:
- economically viable to vertical scale up by adding resources(CPU, RAM, Network, Disk)
- Operational impact of Scalability

# Sharding Architecture

# Setting Up a Sharded Cluster
If you'd like to deploy a sharded cluster on your machine, you can find the commands from the lecture here:
Configuration file for first config server csrs_1.conf:
```
sharding:
  clusterRole: configsvr
replication:
  replSetName: m103-csrs
security:
  keyFile: /var/mongodb/pki/m103-keyfile
net:
  bindIp: localhost,192.168.103.100
  port: 26001
systemLog:
  destination: file
  path: /var/mongodb/db/csrs1.log
  logAppend: true
processManagement:
  fork: true
storage:
  dbPath: /var/mongodb/db/csrs1
```

csrs_2.conf:
```
sharding:
  clusterRole: configsvr
replication:
  replSetName: m103-csrs
security:
  keyFile: /var/mongodb/pki/m103-keyfile
net:
  bindIp: localhost,192.168.103.100
  port: 26002
systemLog:
  destination: file
  path: /var/mongodb/db/csrs2.log
  logAppend: true
processManagement:
  fork: true
storage:
  dbPath: /var/mongodb/db/csrs2
```

csrs_3.conf:
```
sharding:
  clusterRole: configsvr
replication:
  replSetName: m103-csrs
security:
  keyFile: /var/mongodb/pki/m103-keyfile
net:
  bindIp: localhost,192.168.103.100
  port: 26003
systemLog:
  destination: file
  path: /var/mongodb/db/csrs3.log
  logAppend: true
processManagement:
  fork: true
storage:
  dbPath: /var/mongodb/db/csrs3
```

Starting the three config servers:
```
mongod -f csrs_1.conf
mongod -f csrs_2.conf
mongod -f csrs_3.conf
```

Connect to one of the config servers:
`mongo --port 26001`

Initiating the CSRS:
`rs.initiate()`

Creating super user on CSRS:
```
use admin
db.createUser({
  user: "m103-admin",
  pwd: "m103-pass",
  roles: [
    {role: "root", db: "admin"}
  ]
})
```

Authenticating as the super user:
`db.auth("m103-admin", "m103-pass")`

Add the second and third node to the CSRS:
`rs.add("192.168.103.100:26002")`
`rs.add("192.168.103.100:26003")`

Mongos config (mongos.conf):
```
sharding:
  configDB: m103-csrs/192.168.103.100:26001,192.168.103.100:26002,192.168.103.100:26003
security:
  keyFile: /var/mongodb/pki/m103-keyfile
net:
  bindIp: localhost,192.168.103.100
  port: 26000
systemLog:
  destination: file
  path: /var/mongodb/db/mongos.log
  logAppend: true
processManagement:
  fork: true
```

Start the mongos server:
`mongos -f mongos.conf`

Connect to mongos:
`mongo --port 26000 --username m103-admin --password m103-pass`

Check sharding status:
`MongoDB Enterprise mongos> sh.status()`

Updated configuration for node1.conf:
```
sharding:
  clusterRole: shardsvr
storage:
  dbPath: /var/mongodb/db/node1
  wiredTiger:
    engineConfig:
      cacheSizeGB: .1
net:
  bindIp: 192.168.103.100,localhost
  port: 27011
security:
  keyFile: /var/mongodb/pki/m103-keyfile
systemLog:
  destination: file
  path: /var/mongodb/db/node1/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-repl
```

Updated configuration for node2.conf:
```
sharding:
  clusterRole: shardsvr
storage:
  dbPath: /var/mongodb/db/node2
  wiredTiger:
    engineConfig:
      cacheSizeGB: .1
net:
  bindIp: 192.168.103.100,localhost
  port: 27012
security:
  keyFile: /var/mongodb/pki/m103-keyfile
systemLog:
  destination: file
  path: /var/mongodb/db/node2/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-repl
```

Updated configuration for node3.conf:
```
sharding:
  clusterRole: shardsvr
storage:
  dbPath: /var/mongodb/db/node3
  wiredTiger:
    engineConfig:
      cacheSizeGB: .1
net:
  bindIp: 192.168.103.100,localhost
  port: 27013
security:
  keyFile: /var/mongodb/pki/m103-keyfile
systemLog:
  destination: file
  path: /var/mongodb/db/node3/mongod.log
  logAppend: true
processManagement:
  fork: true
replication:
  replSetName: m103-repl
```

Connecting directly to secondary node (note that if an election has taken place in your replica set, the specified node may have become primary):
mongo --port 27012 -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin"

Shutting down node:
```
use admin
db.shutdownServer()
```

Restarting node with new configuration:
`mongod -f node2.conf`

Stepping down current primary:
`rs.stepDown()`

Adding new shard to cluster from mongos:
`sh.addShard("m103-repl/192.168.103.100:27012")`

# Lab: Deploy a Sharded Cluster
1. Start up a mongos process to provide an interface to your sharded cluster. 
```
sharding:
  configDB: csrs/localhost:27004,localhost:27005,localhost:27006
```
`mongos -f mongos.conf`
2. Add shard1 as the first shard in the cluster.
```
mongo --port 26000 --username m103-admin --password m103-pass
sh.status()
sh.addShard("shard1/localhost:27001")
sh.status()
```

# Config DB

Switch to config DB:
`use config`

Query config.databases:
`db.databases.find().pretty()`

Query config.collections:
`db.collections.find().pretty()`

Query config.shards:
`db.shards.find().pretty()`

Query config.chunks:
`db.chunks.find().pretty()`

Query config.mongos:
`db.mongos.find().pretty()`

# Shard Keys
this is a indexed field(s) which mongodb uses to partition data in sharded collection and distribute acorss shard cluster.
shard key value is mutable, even though the shard key itself is immutable. If you're interested, you can read more in the Shard Key documentation https://docs.mongodb.com/manual/core/sharding-shard-key/index.html
- shard keys determines data distribution in a sharded cluster
- shard keys are immutable
- shard key values are immutable
- you should create a index before sharding on the index field(s)

# Chunks
contiguous range of shard key values within a particular shard. Chunk ranges are inclusive of the lower boundary and exclusive of the upper boundary. MongoDB splits chunks when they grow beyond the configured chunk size, which by default is 64 megabytes. MongoDB migrates chunks when a shard contains too many chunks of a collection relative to other shards. 

Show collections in m103 database:
```
use m103
show collections
```

Enable sharding on the m103 database:
`sh.enableSharding("m103")`

Find one document from the products collection, to help us choose a shard key:
`db.products.findOne()`

Create an index on sku:
`db.products.createIndex( { "sku" : 1 } )`

Shard the products collection on sku:
`sh.shardCollection("m103.products", {"sku" : 1 } )`

Checking the status of the sharded cluster:
`sh.status()`

# Picking a Good Shard Key
-Types of change:(write distribution should be even)
  - High Cardinality: number of unique possible value is higher 
  - Low Frequency: how often a unique value occurs in data
  - Avoid Motonic increase or decrease : possible shard key values are changing in steady progressive range
- Read Isolation is good

- You can unshard a collection once sharded
- You can not update shard keys of sharded collection
- You cannot update the values of the shard key for any document in the sharded collection
- Test your shard keys in staging envrionment before sharding in production environment

# Hashed Shard Keys
shard key where underlying index is hashed
Mostly used in the case of Motonic increase or decrease like timestamp

Drawback:
- queries on ranges of shard key values are more likely to be scatter-gather
- it cannot support geographically isolated read operations using zoned sharding
- cannot create hashed compoud index 
- hashed index must be single non-array field
- hashed indexes doesn't support fast sorting

1. `sh.enableSharding("<database>")` to enable sharding on specific database
2. `db.collection.createIndex( { "<field>": "hashed" } )` to create the index for shard key
3. to shard the collection
```
sh.shardCollection(
  "<database>.<collection>", { <shard key field>: "hashed" }
)
```

# Lab: Shard a Collection
1. Use mongoimport to import the data in /dataset/products.json
`mongoimport --port=26000 --db=m103 --collection=products --username=m103-admin --password=m103-pass --authenticationDatabase admin --drop "/dataset/products.json"`
2. Enable sharding on the m103 database.
`mongo --port 26000 --username m103-admin --password m103-pass`
`sh.status()`
`sh.enableSharding("m103")`
3. Choose a shard key for the m103.products collection.
sku (Stock Keeping Unit) is a randomly generated integer unique to each product - this is commonly used to refer to specific products when updating stock quantities

4. Create an index on your shard key and shard the collection.
`db.products.createIndex( { "sku" : 1 } )`
`sh.shardCollection("m103.products", {"sku" : 1 } )`
`sh.status()`

# Chunks
logical groups of documents
chunk size will determine the number of chunks
chunk ranges have inclusive minimum and exclusive maximum

Show collections in config database:
`use config`
`show collections`

Find one document from the chunks collection:
`db.chunks.findOne()`

Change the chunk size:
`use config`
`db.settings.save({_id: "chunksize", value: 2})`

Check the status of the sharded cluster:
`sh.status()`

Import the new products.part2 dataset into MongoDB:
`mongoimport /dataset/products.part2.json --port 26000 -u "m103-admin" -p "m103-pass" --authenticationDatabase "admin" --db m103 --collection products`

# Lab: Documents in Chunks

# Balancing
- balancer evenly distributes the chunks in shards.
- balancer process runs on the config server's primary memeber of the replica set
- balancer looks into chunks distribution of data across the shard clusters and looks for certain migration thresholds
- if it detects there is a imbalance, it starts a Balancer round
- balancer can migrate chunks in parallel
- at a time any shard cannot participate in more than one migration
- 

Start the balancer:
`sh.startBalancer(timeout, interval)`

Stop the balancer:
`sh.stopBalancer(timeout, interval)`

Enable/disable the balancer:
`sh.setBalancerState(boolean)`

Read more - https://docs.mongodb.com/manual/tutorial/manage-sharded-cluster-balancer/#sharding-schedule-balancing-window

# Queries in a Sharded Cluster
sort() - mongos passes the sort to each shard and merge sort the result
limit() - mongos passes the limit to each targeted shard, and then reapplies the limit to the merged set of results
skip() - the mongos performs the skip against the merged set of results 

When used in conjunction with a limit(), the mongos will pass the limit plus the value of the skip() to the shards to ensure a sufficient number of documents are returned to the mongos to apply the final limit() and skip() successfully.

You can read more about routing Aggregation queries in a sharded cluster on the MongoDB sharding docs. - https://docs.mongodb.com/manual/core/aggregation-pipeline-sharded-collections/

# Targeted Queries vs Scatter Gather
targeted : when mongos have the query predicate as the shard keys, mongos knows which shard to go to
scatter-gather : when query predicate does not belong to shard key, mongos will send the query to all shards and merge all their result

Targeted query with explain() output:
`db.products.find({"sku" : 1000000749 }).explain()`

Scatter gather query with explain() output:
```
db.products.find( {
  "name" : "Gods And Heroes: Rome Rising - Windows [Digital Download]" }
).explain()
```



