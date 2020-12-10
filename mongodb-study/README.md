## mongoDB M001: MongoDB Basics
Ref: https://university.mongodb.com/mercury/M001/2020_December_8/overview   

## Chapter 1: Basics
- Document - a way to organize and store data as a set of field-value pairs.
- Field - a unique identifier for a datapoint.
- Value - data related to a given identifier.
- Collection - an organized store of documents in MongoDB, usually with common fields between documents. There can be many collections per database and many documents per collection.
- Replica Set - a few connected machines that store the same data to ensure that if something happens to one of the machines the data will remain intact. Comes from the word replicate - to copy something.
- Instance - a single machine locally or in the cloud, running a certain software, in our case it is the MongoDB database.
- Cluster - group of servers that store your data.

# BSON
Binary-JSON optimized for speed, space flexibility for high performance
mongoDB stored in BSOn but viewed in JSON

Ref - 
https://www.mongodb.com/json-and-bson
http://bsonspec.org/

## Chapter 2: Importing, Exporting and Querying data
# Import & Export
- `mongoimport` : imports data in JSON format
- `mongoexport` : exports data in JSON format
- `mongorestore` : imports data in BSON format
- `mongodump` : exports data in BSON format

Ref - https://docs.mongodb.com/manual/reference/program/mongoimport/#compatibility

# SRV
SRV connection string - a specific format used to establish a connection between your application and a MongoDB instance
Ref - https://docs.mongodb.com/manual/reference/connection-string/#connections-dns-seedlist

# Code Chapter 2
`mongodump --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"

mongoexport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --collection=sales --out=sales.json

mongorestore --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"  --drop dump

mongoimport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --drop sales.json`

# Data Explorer
Namespace - The concatenation of the database name and collection name is called a namespace.

Quiz - In the sample_training.trips collection a person with birth year 1961 took a trip that started at "Howard St & Centre St". What was the end station name for that trip?

Answer: "South End Ave & Liberty St"

# find()

`mongo "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/admin"` - `admin` target authentication database
`show dbs` - show the list of databases in the cluster
`use sample_training` - use a database
`show collections` - see collecions in a database
`db.zips.find({"state": "NY"})` - query with find command
`it` - iterates through the cursor
`db.zips.find({"state": "NY"}).count()` - gives a count of the documents
`db.zips.find({"state": "NY", "city": "ALBANY"})` - more filter
`db.zips.find({"state": "NY", "city": "ALBANY"}).pretty()` - readable format

`cursor` - a pointer to a result set of query
`pointer` - address of the memory location

# Data Explorer Quiz: Chapter 2

`use sample_training`

In the sample_training.trips collection a person with birth year 1961 took a
trip that started at "Howard St & Centre St". What was the end station name for
that trip?
`db.trips.find({ "birth year": 1961, "start station name": "Howard St & Centre St"}).pretty()`

Find All the Documents Exercise:

Using the sample_training.inspections collection find out how many inspections
were conducted on Feb 20 2015.

`db.inspections.find({ "date": "Feb 20 2015"}).count()`

1. Query the zips collection from the sample_training database to find all
   documents where the state is New York.
   `db.zips.find({ "state": "NY"}).pretty()`
2. Iterate through the query results.
    `it`
3. Find out how many ZIP codes there are in NY state.
    `db.zips.find({ "state": "NY"}).count()`
4. What about the ZIP codes that are in NY but also in the city of Albany?
    `db.zips.find({ "state": "NY", "city": "ALBANY"})`
    `db.zips.find({ "state": "NY", "city": "ALBANY"}).count()`
5. Make the cursor look more readable.
    `db.zips.find({ "state": "NY", "city": "ALBANY"}).pretty()`

## Chapter 3: Creating and manipulating documents

# Insert new Document
`_id` every document must have a unique id
`ObjectId()` - created by default for teh _id field if it is not specified otherwise.

Ref - https://docs.mongodb.com/manual/reference/method/ObjectId/index.html#objectid

# insert()
`use sample_training` - select database
`db.inspections.findOne()` - find a random document from collection

# insert() order - multiple documents
insert 3 documents
`db.inspections.insert([ { "test": 1 }, { "test": 2 }, { "test": 3 } ])`
- Insert multiple documents specifying the _id values, and using the "ordered": false option.
` db.inspections.insert([{ "_id": 1, "test": 1 },{ "_id": 1, "test": 2 },{ "_id": 3, "test": 3 }],{ "ordered": false })`
- implicit collection creation by trying to insert document into a collection which doesn't exist

Ref - https://docs.mongodb.com/manual/core/schema-validation/index.html#schema-validation

# update()
Update all documents in the zips collection where the city field is equal to "HUDSON" by adding 10 to the current value of the "pop" field.
`db.zips.updateMany({ "city": "HUDSON" }, { "$inc": { "pop": 10 } })`

`$inc` - MQL operator to increment a filed

- implicit fileds will insert new fields when doesn't exist

Update a single document in the zips collection where the zip field is equal to "12534" by setting the value of the "popupation" field to 17630.
`db.zips.updateOne({ "zip": "12534" }, { "$set": { "population": 17630 } })`

`$set` - sets field value to a new specified value

Update one document in the grades collection where the student_id is ``250`` *, and the class_id field is 339 , by adding a document element to the "scores" array.
`db.grades.updateOne({ "student_id": 250, "class_id": 339 },{ "$push": { "scores": { "type": "extra credit","score": 100 }}})`

`$push` - adds an element to an array field

Ref - https://docs.mongodb.com/manual/reference/operator/update/#id1

# delete()
Delete all the documents that have test field equal to 1.
`db.inspections.deleteMany({ "test": 1 })`

Delete one document that has test field equal to 3.
`db.inspections.deleteOne({ "test": 3 })`

Inspect what is left of the inspection collection.
`db.inspection.find().pretty()`

Drop the inspection collection.
`db.inspection.drop()`

# Assignment

1. Get a random document from a collection
`db.inspections.findOne()`
2. Copy this random document, and insert it back to the collection. Do you get
   a "Duplicate Key" error?
   - `db.inspections.insert(<output of above>)`
   - `Yes`
3. Insert that document into the collection without the _id field to get a
   successfull insert. Did it work?
   - `Yes`

## Chapter 4: Advanced CRUD Operations

Inserting New Documents - insert() order:
1. Insert three test documents into the inspections collection
   db.inspections.insert([{"test":1},{"test":2},{"test":3}])
2. Insert the same three documents into the inspections collection. Did it
   work? Why? - Yes, because we did not provided _id field so it generated ObjectId
3. Insert these three test documents into the inspections collection. Did it
   work? Why? - No, because test 1 and test 2 has same field and it did not went further as it is by default ordered
   db.inspections.insert([{"_id": 1, "test": 1},{"_id": 1, "test": 2},{"_id": 3,"test": 3}])
4. Try the same insert as above but make it unordered.
    `db.inspections.insert([{"_id": 1, "test": 1},{"_id": 1, "test": 2},{"_id": 3,"test": 3}],{ "ordered": false })`
5. Try this command. Did it work? Why?
   db.inspection.insert([{ "_id":1, "test": 1 },{ "_id": 3,"test": 3 }])
    - Yes, as it has different collection name

Updating Documents  - mongo shell

1. Find all documents in the zips collection where the zip field is equal to
   "12434".
   `db.zips.find({"zip": "12434"})`
2. Find all documents in the zips collection where the city field is equal to
   "HUDSON".
   `db.zips.find({"city": "HUDSON"})`
3. Find how many documents in the zips collection have the zip field is equal
   to "HUDSON".
   `db.zips.find({"zip": "HUDSON"}).count()`
4. Update all documents in the zips collection where the city field is equal
   to "HUDSON" by adding 10 to the current value of the "pop" field.
   `db.zips.updateMany({ "city": "HUDSON" }, { "$inc": { "pop": 10 } })`
5. Update a single document in the zips collection where the zips field is
   equal to "12534" by setting the value of the "pop" field to 17630.
   `db.zips.updateOne({ "zip": "12534" }, { "$set": { "pop": 17630 } })`
6. Update a single document in the zips collection where the zips field is
   equal to "12534" by setting the value of the "population" field to 17630.
   `db.zips.updateOne({ "zip": "12534" }, { "$set": { "population": 17630 } })`
7. Find all documents in the grades collection where the student_id is 151,
   and the class_id field is 399.
   `db.grades.find({ "student_id": 151, "class_id": 399})`
8. Find all documents in the grades collection where the student_id is 250,
   and the class_id field is 399.
   `db.grades.find({ "student_id": 250, "class_id": 399})`
9. Update one document in the grades collection where the student_id is 250,
   and the class_id field is 399, by adding a document element to the "scores"
   array.
    `db.grades.updateOne({ "student_id": 250, "class_id": 339 },{ "$push": { "scores": { "type": "extra credit","score": 100 }}})`

# Practice Question:

People often confuse New York City as the capital of New York state, when in
reality the capital of New York state is Albany.

Add a boolean field "capital?" to all documents pertaining to Albany NY, and
New York, NY. The value of the field should be true for all Albany documents
and false for all New York documents.

`db.zips.updateMany({ "state": "NY", "city": "ALBANY"},{ "$push": { "capital?": true}})`

`db.zips.updateMany({ "state": "NY", "city": "NEW YORK"},{ "$push": { "capital?": false}})`

Deleting Documents and Collections

1. Look at all the documents in the inspections collection that have test field
   equal to 1.
   `db.inspections.find({"test": 1})`
2. Look at all the documents in the inspections collection that have test field
   equal to 3.
   `db.inspections.find({"test": 3})`
3. Delete all the documents from the inspections collection that have test
   field equal to 1
   `db.inspections.deleteMany({"test": 1})`
4. Delete one document from the inspections collection that has test field
   equal to 3
   `db.inspections.deleteOne({"test": 3})`
5. Inspect what is left of the inspection collection.
    `db.inspection.find()`
6. View what collections are present in the sample_training collection.
    `show collections`
7. Drop the inspection collection
    `db.inspection.drop()`

# Query Operators: Comparison

- Update operatora - $inc, $set, $unset`
- $eq, $neq
- $gt, $lt
- $gte, $lte
- 


Find all documents where the tripduration was `less than or equal to 70 seconds` and the usertype was not Subscriber:
`db.trips.find({ "tripduration": { "$lte" : 70 },"usertype": { "$ne": "Subscriber" } }).pretty()`

Find all documents where the tripduration was less than or equal to 70 seconds and the usertype was Customer using a redundant equality operator:
`db.trips.find({ "tripduration": { "$lte" : 70 }, "usertype": { "$eq": "Customer" }}).pretty()`

Find all documents where the tripduration was less than or equal to 70 seconds and the usertype was Customer using the implicit equality operator:
`db.trips.find({ "tripduration": { "$lte" : 70 },"usertype": "Customer" }).pretty()`

# Query Operators: Logical
- $and 
- $or
- $nor
- $not

Find all documents where airplanes CR2 or A81 left or landed in the KZN airport:
`db.routes.find({ "$and": [ { "$or" :[ { "dst_airport": "KZN" }, { "src_airport": "KZN" }] },{ "$or" :[ { "airplane": "CR2" }, { "airplane": "A81" } ] } ]}).pretty()`

# Expressive Query Operator $expr
Find all documents where the trip started and ended at the same station:
`db.trips.find({ "$expr": { "$eq": [ "$end station id", "$start station id"] }}).count()`

Find all documents where the trip lasted longer than 1200 seconds, and started and ended at the same station:
`db.trips.find({ "$expr": { "$and": [ { "$gt": [ "$tripduration", 1200 ]}, { "$eq": [ "$end station id", "$start station id" ]}   ]}}).count()`

# Array Operator
- $push
 ( <array field> : { "$size": <number>}) - returns a cursor with all documents where the specified array field is exactly given length

 ( <array field> : { "$all": <array>}) - returns a cursor with all documents 


Find all documents with exactly 20 amenities which include all the amenities listed in the query array:
`db.listingsAndReviews.find({ "amenities": {  "$size": 20,  "$all": [ "Internet", "Wifi",  "Kitchen",   "Heating", "Family/kid friendly",   "Washer", "Dryer", "Essentials",   "Shampoo", "Hangers",   "Hair dryer", "Iron",   "Laptop friendly workspace" ]    }).pretty()`

Ref - https://docs.mongodb.com/manual/reference/operator/update/#id1

`{ <query> , { <projection>}}`
- 1 include the field
- 0 exclude the field

you cannot mix `0` and `1` in the same projection with an exception of excluding `_id` which is by default always in projection

`$elemMatch` - used both in query and projection
- it matches that contains an array field with at least one element that matches the specified query criteria.
- projects only that contains an array field with at least one element that matches the specified query criteria.

Find all documents with exactly 20 amenities which include all the amenities listed in the query array, and display their price and address:

`db.listingsAndReviews.find({ "amenities":    { "$size": 20, "$all": [ "Internet", "Wifi",  "Kitchen", "Heating", "Family/kid friendly", "Washer", "Dryer", "Essentials", "Shampoo", "Hangers", "Hair dryer", "Iron","Laptop friendly workspace" ] } },{"price": 1, "address": 1}).pretty()`

Find all documents that have Wifi as one of the amenities only include price and address in the resulting cursor:
`db.listingsAndReviews.find({ "amenities": "Wifi" },   { "price": 1, "address": 1, "_id": 0 }).pretty()`

Find all documents that have Wifi as one of the amenities only include price and address in the resulting cursor, also exclude ``"maximum_nights"``. **This will be an error:*

`db.listingsAndReviews.find({ "amenities": "Wifi" },{ "price": 1, "address": 1,"_id": 0, "maximum_nights":0 }).pretty()`

Find all documents where the student in class 431 received a grade higher than 85 for any type of assignment:
`db.grades.find({ "class_id": 431 },  { "scores": { "$elemMatch": { "score": { "$gt": 85 } } } }).pretty()`

Find all documents where the student had an extra credit score:
`db.grades.find({ "scores": { "$elemMatch": { "type": "extra credit" } }   }).pretty()`


# Sub documents
 $regex

`db.trips.findOne({ "start station location.type": "Point" })`

`db.companies.find({ "relationships.0.person.last_name": "Zuckerberg" },  { "name": 1 }).pretty()`

`db.companies.find({ "relationships.0.person.first_name": "Mark",    "relationships.0.title": { "$regex": "CEO" } },  { "name": 1 }).count()`

`db.companies.find({ "relationships.0.person.first_name": "Mark",    "relationships.0.title": {"$regex": "CEO" } },  { "name": 1 }).pretty()`

`db.companies.find({ "relationships":  { "$elemMatch": { "is_past": true,    "person.first_name": "Mark" } } },  { "name": 1 }).pretty()`

`db.companies.find({ "relationships":  { "$elemMatch": { "is_past": true,    "person.first_name": "Mark" } } },  { "name": 1 }).count()`

Ref - https://docs.mongodb.com/manual/tutorial/query-arrays/
https://docs.mongodb.com/manual/reference/operator/query/regex/index.html

# Query Operators - Comparison

1. How many documents in the sample_training.zips collection have fewer than
   1000 people listed in the pop field?
   `db.zips.find({ "pop": { "$lt": 1000}}).count()`
   8065
2. What is the difference between the number of people born in 1998 and the
   number of people born after 1998 in the sample_training.trips collection?
`db.trips.find({"birth year": {"$gt": 1998}}).count() - db.trips.find({"birth year": {"$eq": 1998}}).count()`
    6
3. Using the sample_training.routes collection find out which of the
   following statements will return all routes that have at least one stop
   in them?

        -  db.routes.find({ "stops": { "$gt": 0 }}).pretty() - right
        -  db.routes.find({ "stops": { "$gte": 0 }}).pretty()
        -  db.routes.find({ "stops": { "$ne": 0 }}).pretty() - right
        -  db.routes.find({ "stops": { "$lt": 10 }}).pretty()
    
# Query Operators - Logic

1. How many businesses in the sample_training.inspections dataset have the
   inspection result "Out of Business" and belong to the Home Improvement
   Contractor - 100 sector?
   `db.inspections.find({ "$and" : [ { "result" : "Out of Business"}, { "sector" : "Home Improvement Contractor - 100"}]}).count()`
   4
2. How many zips in the sample_training.zips dataset are neither over-
   populated nor under-populated?

   In this case, we consider population over 1,000,000 to be over-populated
   and under 5,000 to be under-populated.

   `db.zips.find({ "$and" : [         { "pop" : { "$lte" : 1000000}},         { "pop" : { "$gte": 5000}}        ]}).count()`   
    11193
3. How many companies in the sample_training.companies dataset were either
   founded in 2004, or in the month of October and either have the social
   category_code or web category_code?
   `db.companies.find({ "$and": [{"$or" : [{"founded_year": 2004}, {"founded_month": 10}]}, {"$or" : [{"category_code" : "social"}, {"category_code" : "web"}]}]}).count()`
    149

# Expressive Query Operator

How many companies in the sample_training.companies collection have the same
permalink as their twitter_username?
    `db.companies.find({ "$expr": {"$eq": ["$permalink","$twitter_username"]}}).count()`
    1299
# Array Operators

1. What is the name of the listing in the sample_airbnb.listingsAndReviews
   dataset accommodate more than 6 people and has exactly 50 reviews?   
   `db.listingsAndReviews.find({ "$and": [        { "accommodates" : {"$gt": 6}},         { "number_of_reviews" : {"$eq": 50}}    ]    }, {"name": 1, "_id": 0})`
   
   -Sunset Beach Lodge Retreat
2. How many documents have the property_type House, and include Changing
   table as one of the amenities?
    `db.listingsAndReviews.find({ "$and" : [ {"property_type" : "House"}, {"amenities" : "Changing table"} ] }).count()`
    11

# Array Operators and Projection

How many companies in the sample_training.companies collection have offices
in the city of Seattle?
    `db.companies.find({ "offices.city": "Seattle"}).count()`
    117
# Array Operators and Sub-Documents

1. Latitude decreases in value as you move west.

   How many trips in the sample_training.trips collection started at
   stations that are to the west of the -74 latitude coordinate?

   `db.trips.find({ "start station location.coordinates": { "$lt": -74 }}).count()`
    1928
2. How many inspections from the sample_training.inspections collection were
   conducted in the city of New York?
    `db.inspections.find({ "address.city": "New York"}).count()`
    5
Note: On Chapter 4: Advanced CRUD Operations -> Lab 2: Querying Arrays and Sub-Documents the answer I got was `5` but for some reason it was expecting `18279`. It seemed a data issue to me when I checked the detailed explanation and found the MQL is exact same as mine. Please caeful.

# Query Operators - Comparison

1. Find all documents where the trip was less than or equal to 70 seconds
   and the usertype was not "Subscriber"
   `db.trips.find({        "$and" : [         { "tripduration" : { "$lte": 70}},         { "usertype" : { "$ne": "Subscriber"}}        ]    }).pretty()`

2. Find all documents where the trip was less than or equal to 70 seconds
   and the usertype was "Customer" using a redundant equality operator.
    `db.trips.find({        "$and" : [         { "tripduration" : { "$lte": 70}},         { "usertype" : { "$eq": "Customer"}}        ]    }).pretty()`

3. Find all documents where the trip was less than or equal to 70 seconds
   and the usertype was "Customer" using the implicit equality operator.
    `db.trips.find({        "$and" : [         { "tripduration" : { "$lte": 70}},         { "usertype" : "Customer"}        ]    }).pretty()`

# Query Operators - Logic

Find all documents where airplanes CR2 or A81 left or landed in the KZN
airport.
 `db.routes.find({     "$and" : [         { "$or": [{ "src_airport": "KZN"}, { "dst_airport": "KZN"}]},         { "$or": [{ "airplane": "CR2"}, { "airplane": "A81"}]}     ] }).pretty()`
    
# Expressive Query Operator

1. Find all documents where the trip started and ended at the same station.
    `db.trips.find({ "$expr" : { "$eq" : [ "$start station id", "$end station id" ] }}).pretty()`
2. Find all documents where the trip lasted longer than 1200 seconds, and
   started and ended at the same station.
    `db.trips.find({         "$and" : [             { "$expr" : { "$eq" : [ "$start station id", "$end station id" ] }},             { "tripduration" : {"$gt" : 1200}}         ]     }).pretty()`
    
# Array Operators

1. Find all documents that contain more than one amenity without caring
   about the order of array elements.
   `db.listingsAndReviews.find({ "amenities": { $size: 2 } }).pretty()`
2. Only return documents that list exactly 20 amenities in this field and
   contain the amenities of your choosing.
    `db.listingsAndReviews.find({ "amenities":    { "$size": 20, "$all": [ "Internet", "Wifi",  "Kitchen", "Heating", "Family/kid friendly","Laptop friendly workspace" ] } }).pretty()`
# Array Operators and Projection

1. Find all documents in the sample_airbnb database with exactly 20
   amenities which include all the amenities listed in the query array, and display their price and address.
    `db.listingsAndReviews.find({ "amenities":    { "$size": 20, "$all": [ "Internet", "Wifi",  "Kitchen", "Heating", "Family/kid friendly", "Washer", "Dryer", "Essentials", "Shampoo", "Hangers", "Hair dryer", "Iron","Laptop friendly workspace" ] } },{"price": 1, "address": 1}).pretty()`

2. Find all documents in the sample_airbnb database that have Wifi as one of
   the amenities only include price and address in the resulting cursor.
   `db.listingsAndReviews.find({ "amenities": "Wifi" },   { "price": 1, "address": 1, "_id": 0 }).pretty()`

3. Find all documents in the sample_airbnb database that have Wifi as one of
   the amenities only include price and address in the resulting cursor,
   also exclude "maximum_nights".
   Was this operation successful? Why?
   - No, because projection cannot mix 0s and 1s except it is excluding _id
4. Find all documents in the grades collection where the student in class
   431 received a grade higher than 85 for any type of assignment.
   
   `db.grades.find({ "class_id": 431 },  { "scores": { "$elemMatch": { "score": { "$gt": 85 } } } }).pretty()`

5. Find all documents in the grades collection where the student had an
   extra credit score.
    `db.grades.find({ "scores": { "$elemMatch": { "type": "extra credit" } }   }).pretty()`

# Array Operators and Sub-Documents

1. Find any document from the companies collection where the last name
   Zuckerberg in the first element of the relationships array.
2. Find how many documents from the companies collection have CEOs who's
   first name is Mark and who are listed as the first relationship in this
   array for their company entry.
3. Find all documents in the companies collection where people named Mark
   used to be in the senior company leadership array, a.k.a the
   relationships array, but are no longer with the company.

## Chapter 5: Indexing and Aggregation pipeline
used to query data from MongoDB other than MQL

# Why?
- $group : takes incoming stream of data and then siphons it to multiple distinct reservoirs
- no filtering stages do not modify data, instead they work with the data present in the cursor
- calculations like $sum
- Exceeds the capabilities of MQL
- it's formed with pipeline 

More: https://university.mongodb.com/courses/M121/about

Find all documents that have Wifi as one of the amenities. Only include price and address in the resulting cursor.
`db.listingsAndReviews.find({ "amenities": "Wifi" },   { "price": 1, "address": 1, "_id": 0 }).pretty()`

Using the aggregation framework find all documents that have Wifi as one of the amenities``*. Only include* ``price and address in the resulting cursor.
`db.listingsAndReviews.aggregate([  { "$match": { "amenities": "Wifi" } },  { "$project": { "price": 1,  "address": 1,  "_id": 0 }}]).pretty()`

Find one document in the collection and only include the address field in the resulting cursor.
`db.listingsAndReviews.findOne({ },{ "address": 1, "_id": 0 })`

Project only the address field value for each document, then group all documents into one document per address.country value.
`db.listingsAndReviews.aggregate([ { "$project": { "address": 1, "_id": 0 }},  { "$group": { "_id": "$address.country" }}])`

Project only the address field value for each document, then group all documents into one document per address.country value, and count one for each document in each group.
`db.listingsAndReviews.aggregate([  { "$project": { "address": 1, "_id": 0 }},  { "$group": { "_id": "$address.country",    "count": { "$sum": 1 } } }])`

# cursor methods: sort() & limit(), skip()
- applied on the cursor
- you can sort data on one or more fields in increasing and decreasing order
- always sort first and then limit
- using only limit is not recommended also using limit before sort is not a good practise

Ref - https://docs.mongodb.com/manual/reference/method/cursor.skip/index.html

get the zipcodes with ascending population order and get the first document - which is least populated
`db.zips.find().sort({ "pop": 1 }).limit(1)`
get the zip codes where population is 0
`db.zips.find({ "pop": 0 }).count()`
get the zipcodes with descending order and get the first document - which is the most populated 
`db.zips.find().sort({ "pop": -1 }).limit(1)`
get the first 10
`db.zips.find().sort({ "pop": -1 }).limit(10)`

`db.zips.find().sort({ "pop": 1, "city": -1 })`

# Indexes
it is special data structure that stores a small portion of the collection's data set in an easy to traverse form. It make queries more efficient. 

`db.trips.find({ "birth year": 1989 })`

`db.trips.find({ "start station id": 476 }).sort( { "birth year": 1 } )`

create index
`db.trips.createIndex({ "birth year": 1 })`
after indexing sorting on the index field can be avoided
`db.trips.createIndex({ "start station id": 476, "birth year": 1 })`

- single field index
- cpmpound index - when multiple fields are indexed

More about performance and indexing with MongoDB: https://university.mongodb.com/courses/M201/about

# Data modeling
a way to organize fields in a document to support your application performance and querying capabilities.
- Data which is accessed together should be stored together

Course - https://university.mongodb.com/courses/M320/about

# Upsert - update or insert?
hybrid of update and insert command
- by default upsert is set to false
- if there is a match `update` will happen, if there is no match then `insert` will happen

syntax - `db.<collection>.updateOne({<query>}, {<update>}, {"upsert": true})`

`db.iot.updateOne({ "sensor": r.sensor, "date": r.date,   "valcount": { "$lt": 48 } }, { "$push": { "readings": { "v": r.value, "t": r.time } },    "$inc": { "valcount": 1, "total": r.value } }, { "upsert": true })`


## Quiz - Aggregation Framework

What room types are present in the sample_airbnb.listingsAndReviews
collection?
    `db.listingsAndReviews.aggregate([ { "$group": { "_id": "$room_type" }}])`
    { "_id" : "Shared room" }
    { "_id" : "Private room" }
    { "_id" : "Entire home/apt" }

sort() and limit()
    `db.listingsAndReviews.find().sort({ "minimum_nights": -1}).limit(1).pretty()`

In what year was the youngest bike rider from the sample_training.trips
collection born?
    `db.trips.find().sort({"birth year": 1}).limit(1).pretty()`
    1885
# Aggregation Framework

1. Using the aggregation framework find all documents that have Wifi as one
   of the amenities. Only include price and address in the resulting cursor.
    `db.listingsAndReviews.aggregate([  { "$match": { "amenities": "Wifi" } },  { "$project": { "price": 1,  "address": 1,  "_id": 0 }}]).pretty()`
2. Which countries have listings in the sample_airbnb database?
    `db.listingsAndReviews.aggregate([ { "$project": { "address": 1, "_id": 0 }},  { "$group": { "_id": "$address.country" }}])`
    { "_id" : "Canada" }
    { "_id" : "Australia" }
    { "_id" : "Brazil" }
    { "_id" : "United States" }
    { "_id" : "Spain" }
    { "_id" : "Portugal" }
    { "_id" : "Turkey" }
    { "_id" : "China" }
    { "_id" : "Hong Kong" }
3. How many countries have listings in the sample_airbnb database?
    9
sort() and limit()

1. Find the least populated ZIP code in the zips collection.
    `db.zips.find().sort({ "pop": 1 }).limit(1)`
    36419
2. Find the most populated ZIP code in the zips collection.
    `db.zips.find().sort({ "pop": 1 }).limit(1)`
    60623
3. Find the top ten most populated ZIP codes.
    `db.zips.find().sort({ "pop": 1 }).limit(10)`
4. Get results sorted in increasing order by population, and decreasing
   order by city name.
   `db.zips.find().sort({ "pop": 1, "city": -1 })`

Introduction to Indexes

Create two separate indxes to support the following queries:

db.trips.find({"birth year": 1989})

db.trips.find({"start station id": 476}).sort("birth year": 1)

`db.trips.createIndex({ "birth year": -1 })`
`db.trips.createIndex({ "start station id": 1 })`


## Chapter 6: Next Steps

# Atlas features - More Data Explorer

https://docs.atlas.mongodb.com/reference/atlas-search/tutorial/#fts-tutorial-ref

Realm - https://docs.mongodb.com/realm/
Application development course - https://university.mongodb.com/learning_paths/developer
charts - https://docs.mongodb.com/charts/saas/tutorial/order-data/order-data-tutorial-overview/

# Compass
https://docs.mongodb.com/compass/current/validation/
https://docs.mongodb.com/manual/core/schema-validation/
https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
https://www.mongodb.com/blog/post/json-schema-validation--checking-your-arrays

# Useful Links
MongoDB Developer Hub - https://developer.mongodb.com/
MongoDB Community Forums - https://developer.mongodb.com/community/forums/
Case study: Bosch Leads Charge into Internet of Things - https://www.mongodb.com/customers/bosch
Case study: Coinbase - https://www.mongodb.com/customers/coinbase
Case study: SEGA - https://www.mongodb.com/blog/post/sega-hardlight-migrates-to-mongodb-atlas-simplify-ops-improve-experience-mobile-gamers
How the Financial Sector Uses MongoDB - https://www.mongodb.com/industries/financial-services
