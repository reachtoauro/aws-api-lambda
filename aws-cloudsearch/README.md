## Introduction
Basic concept of search engines the what and how. 

# Steps
1. build a search domain
2. configure 
3. data upload
4. query builder
5. Ranking
6. Query in different ways: field weighting, geospatial, facets

# Technology
Amazon CloudSearch - fully managed search service. It is scalable, easy to create and update, cost efficient also depending on use cases leveraged for availability.

# Search Engine
A search engine provides best suited information based on user query/search. It has gamut of data and it scores and ranks them.

# Document
Documents are data loaded into system mostly in key-value pairs. They are composite objects of various different kinds of information. Like for eCommerce the documents will be products and for web search the documents are web pages. 

# Queries
What the user enters for their search. The query contains words which are matched against the text that is stored in the documents.

# Index
This is the heart of all search engines. Index helps you locate the word you're looking for quickly and then gives you the documents where it contains the word. It maps words to the document IDs and the words/terms stored in alphabetical manner to ease the retrival process. 

# Posting list
It is the list of document Ids for a term/word and it also stored the location of the word inside the document.

# Posting list in action
when user enters a query -> it looks for every terms/words in the query in the index -> get a set of posting list
for advance cases if the query has some other logic like sorting or weightage on particular term then it applies those logic and came up with a new set of Document IDs.
Also it ranks those results as well.

# Access Policies
- allow everyone access to allow all the services
- deny everyone to access to all the services
- allowing only the owner to access document and everyone else to query

# Availability Options
You can enable or disable multiple AZ - duplicate your search domain and place copies in separate AZs within a region. 

# Indexing Options
configure indexing options like the fields, the type of fields, analysis schemes for your search domain.
- literal field type provides exact matchign of its content.
- lation - contains latitude and longitude which allows you to perform gesspatial queries
- FacetEnabled—You can get facet information for any FacetEnabled field. Text fields cannot be used for faceting. Valid for: int, int-array, date, date-array, double, double-array, latlon, literal, literal-array.
- ReturnEnabled—You can retrieve the value of any ReturnEnabled field with your search results. 
- HighlightEnabled—You can get highlighting information for the search hits in any HighlightEnabled text field. Valid for: text, text-array.
- SearchEnabled—You can search the contents of any SearchEnabled field. Text fields are always searchable. 
- SortEnabled—You can sort the search results alphabetically or numerically using any SortEnabled field.
- text and text-array fields are always searchable

- Types
    - date - contains timestamp
    - date-array - multiple date fields
    - double/double-array 
    - int/int-array
    - latlon - contains a location stored as a latitude and longitude value pair (lat, lon).
    - literal—contains an identifier or other data that you want to be able to match exactly. Literal fields are case-sensitive.
    - literal-array—a literal field that can contain multiple values.
    - text—contains arbitrary alphanumeric data.
    - text-array—a text field that can contain multiple values.

# Scaling options
define your minimum desired instance types 

# Suggesters
you can create suggeters for auto completing search terms

# Expressions
algebric equeations to allow customized ranking

# Analysis schemes
customize the handling of your text fields

## Queries 101
# Basic
It retrieves all of the documents (songs) within your search domain that contains the word 'dance'.
`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=dance`

search endpoint: `http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com`
The API version is `2013-01-01`
'operation' we will execute `search`
use the 'q' parameter, which searches against all text fields in the domain: `q`

CloudSearch always returns the document ID, and by default it also returns values for all fields with “return” enabled.
- You can modify this behavior with the “return=“ parameter e.g., by appending `&return=artist_name`
- You can also retrieve XML data with the “format=“ parameter e.g., by appending `&format=xml`

# Structured Query
allows the retrieval of results based on a logic expression that considers two different fields at the same time
`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=(and song_title:'love' album_title:'hits')&return=_score,_all_fields&q.parser=structured`

we want to retrieve all songs that contains the word 'love' in the song_title field, and the word 'hits' in the album_title field
`q=(and song_title:'love' album_title:'hits')`

contains a return parameter, with two values (_score and _all_fields), which are internal CloudSearch fields. They indicate we want to retrieve the calculated score for each of the documents (_score) and all of the fields within the search domain (_all_fields)
`return=_score,_all_fields`

is necessary to tell CloudSearch we are using an structured expression within the q parameter.
`q.parser=structured`

# Filtering
query that filters the results using the 'fq' parameter.

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=song_title:'love'&fq=album_title:'hits'&return=_score,_all_fields&q.parser=structured`

we want to retrieve all songs that contains the word 'love' in the song_title field
`q=song_title:'love'`

we want to filter the results and retrieve only songs that also contains the word 'hits' in the album_title field
`fq=album_title:'hits'`

when you use the structured query, both 'love' and 'hits' are used to calculate the score for each document. But when you use the fq parameter, it is not included in the score calculation, so only the q parameter will be considered when calculating the scores.

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/filtering-results.html

# Sorting
sort CloudSearch results of a given query based on sortable fields. use the sort parameter, specifying which field (or fields) and the direction (ascending or descending) you want to sort results by. only fields marked as sortable in your search domain index configuration can be used in a sort parameter.

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=song_title:'love'&fq=album_title:'hits'&return=_score,_all_fields&q.parser=structured&sort=song_title asc`

indicating the field (or fields) we want to use for sorting, as well as the sort direction (ascending or descending).
`sort=song_title asc`

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/sorting-results.html

# Ranking and Expressions
create custom expressions used to rank results in your queries. In CloudSearch, you can rank the results of your queries by sorting them according to custom expressions you create. For example: every song in the our dataset contains an artist_hotness value. This is a custom field that gives each artist a relevance index within that dataset. You might want to use that value to influence the calculated score for each document, by, for instance, multiplying the calculated score by the artist_hotness value. That way, the artist_hotness will directly influence the calculated score, giving songs from artists with higher artist_hotness values a higher weight and thus a chance to be better ranked than songs from artists with lower artist_hotness values.

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q='cry'&q.parser=structured&expr.artist_rank=_score*artist_hotness&return=artist_rank,_score,_all_fields&sort=artist_rank desc`

it retrieves all songs that contains the word 'cry' on any seachable field
`q='cry'`

create an expression (expr) to the query that creates a new calculated field named artist_rank, based on the product of the calculated score (_score) and the artist_hotness field.
`expr.artist_rank=_score*artist_hotness`

the value of the newly created expression (artist_rank), as well as the calculated score (_score) and all other fields (_all_fields) to be returned for each of the resulting documents.
`return=artist_rank,_score,_all_fields`

sorting them according to the value of the artist_rank expression
`sort=artist_rank desc`

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/configuring-expressions.html

# Paginating Results
CloudSearch will only return the first 10 results of a given query, starting at the first result. If you want to display more than just the first 10 results, you can add a size parameter to the query string, specifying how many results you want to display.
`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q='heart'&return=_all_fields&q.parser=structured&size=10&start=0`

size controls how many items are displayed per page, and start defines the first document (starting with 0) to be displayed. size=10&start=0 represents the default values for CloudSearch.
`size=10&start=0`

The formula used to calculate the start parameter is: start=results_per_page*(current_page-1).
Also, when executing the query, pay attention to the JSON output. The part that says '"hits":{"found":45,"start":0' indicates that the query has found 45 results, and will start showing from the first document.

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/paginating-results.html

# Facets
A facet is an index field that represents a category that you want to use to refine and filter search results. When you submit search requests to Amazon CloudSearch, you can request facet information to find out how many documents share the same value in a particular field. You can display this information along with the search results, and use it to enable users to interactively refine their searches. (This is often referred to as faceted navigation or faceted search.)

we identified the terms field as a facets field. This field contains a list of 5 genres for each song, allowing each song to be classified as being a 'rock' or 'pop' tune, for instance. We will modify the query to ask cloudsearch to bring facets together with search results. This means CloudSearch will retrieve all of the facets (genres) with the total number of songs found on that resultset for each of these genres.

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q='fight'&facet.terms={sort:'count', size:5}`

parameter facet.terms requests facet counts for the “terms” field. You use facet.field_name to retrieve facet counts for the field named field_name.
`facet.terms`

specify additional parameters for each facet.field_name parameter using JSON syntax (facet.field=json object). The first JSON field indicates how the list of facets will be sorted (sort:'count'). You can also use sort:'bucket' to sort the facets list alphabetically.
`sort:'count'`

second JSON field indicates the size of the facets list (size:5). This means only the top 5 facets with be returned.
`size:5`

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/faceting.html

# Fuzzy Search
include results that slightly differ from the query search term but are still considered a match

To perform a fuzzy search, use the simple query parser and append the ~ operator with a number that specifies how many characters can differ and the 2 terms are still considered a match. You can use the q.options parameter to narrow the fields searched.
`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q.options={fields:['artist_name']}&q=jon`

The first parameter q.options={fields:['artist_name']} restricts the query to the artist_name field.
`q.options={fields:['artist_name']}`

second parameter q=jon indicates we want to retrieve documents that match the word 'jon'. This query when executed yields no results as there are no songs on our dataset that contains the word 'jon' within the artist_name field.
`q=jon`

query performing a fuzzy search with a fuzzy value of 1. This will allow any word differing by 1 character to be considered a match. It will bring results that contains, for instance, the word 'John'.
`q=jon~1`

# Sloppy Phrases
When you search for a phrase, you put double quotes around it, for Example q="I think". CloudSearch will only match documents that have all of the words, present and in the same order as the query. "I think" will not match "I don't think", for example.

To perform a sloppy phrase search, append the ~ operator, followed by a value that indicates the total distance, in words, that the terms can span and still generate a match. For example, q="I think"~5 searches for the terms "I" and "think", allowing up to 5 other words between them, which means the results will include phrases like "I still think", "I've never found myself thinking of you", etc.

This is the query we will execute. It's a basic query that searches for the exact phrase "I think" on any of the searchable fields. Notice when executed, that this query will only return 4 results.
`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q="I think"`

sloppy phrase search with a value of 5. This will allow a distance up to 5 words between "I" and "think". It will bring another 4 results in addition to the ones containing the exact match.
`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q="I think"~5`

# Geospatial Search
use the location field (that gives the latitude and longitude where the song was published) to search within an area and a custom ranking function to sort matches based on the value of the haversin distance function for the user’s location and the song’s location.

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=song_title:'love'&q.parser=structured&size=50&return=_all_fields,distance`


It searches for songs containing the word 'love' (q=love). It also returns the first 50 results (size=50), and returns all fields including a calculated expression named 'distance' (returns=_all_fields,distance). We will learn how this expression is calculated next.
`q=song_title:'love'&q.parser=structured&size=50&return=_all_fields,distance`

add an expression named 'distance' (expr.distance=) to the query and sort based on that expression (sort=distance asc).
`sort=distance asc&expr.distance=`

calculate the distance of each of the songs to a given point, we use CloudSearch's haversin function.
`haversin(`

The value 40.69426008566724,-73.96492656250007 corresponds to New York City's longitude and latitude. We will calculate the distance of each of the songs to this point.
`40.69426008566724,-73.96492656250007`

last two parameters are location.latitude and location.longitude. For each matching document, CloudSearch uses the value for these fields as a parameter to the haversin function.
`location.latitude,location.longitude)`

restrict results within a particular area, we use the fq:location= parameter. This means we want to include only results whose location field contains a coordinate within a certain area.
`fq=location:`

To restrict results within a particular area, we use a bounding box as the value for the fq:location parameter. A bounding box is a rectangle represented by the latitudes and longitudes of the upper-left and lower-right corners of a certain area. We will start the query with the following bounding box which correspond to an area around New York City: ['41.62069123043443,-75.94682656250006','39.76782894090004,-71.98302656250007']

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=song_title:'love'&q.parser=structured&size=50&return=_all_fields,distance&sort=distance asc&expr.distance=haversin(40.69426008566724,-73.96492656250007,location.latitude,location.longitude)&fq.location=['41.62069123043443,-75.94682656250006','39.76782894090004,-71.98302656250007']`

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/searching-locations.html

# Field Weighting
You can assign weights to selected fields so you can boost the relevance _score of documents with matches in key fields such as a title field, and minimize the impact of matches in less important fields. By default all fields have a weight of 1.
Field weights are set with the q.options fields option. You specify fields as an array of strings. To set the weight for a field, you append a caret (^) and a positive numeric value to the field name. You cannot set a field weight to zero or use mathematical functions or expressions to define a field weight.

For example, searching for all songs with any text field that has the word 'home' (q=home) and returning the score and all other fields (return=_score,_all_fields)

`http://search-exampledomain-473zriffvvp4oq2tpw3vdj2kki.us-west-2.cloudsearch.amazonaws.com/2013-01-01/search?q=home&return=_score,_all_fields&q.options={fields:['song_title^1','album_title^1']}`

set field weights with the q.options parameter. The value of this parameter is an array of field names, followed by ^ and a value that defines the relative weight of this field within the fields array. We will start with the default value of 1 for both 'song_title' and 'album_name'.
`q.options={fields:['song_title^1','album_title^1']}`

Ref - https://docs.aws.amazon.com/cloudsearch/latest/developerguide/weighting-fields.html

