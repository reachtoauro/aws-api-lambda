const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    var userId = event.userId;
    
    var params = {
      Key: {
       "UserId": {
         S: userId
        }
      }, 
      TableName: "compare-yourself"
     };
     
     dynamodb.deleteItem(params, function(err, data) {
       if (err){
           console.log(err, err.stack); // an error occurred
           callback(err);
       }else{
           console.log(data);           // successful response
           callback(null, 'Successfully deleted!');
       }     
     });
};
