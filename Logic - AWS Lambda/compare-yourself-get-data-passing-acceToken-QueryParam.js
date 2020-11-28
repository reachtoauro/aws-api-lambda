const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var cisp =  new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

exports.handler = (event, context, callback) => {
    var params={};
    var accessToken = event.accessToken;
    
    const type = event.type;
    if(type === 'all'){
        params = {
            TableName: "compare-yourself"
        };
        dynamodb.scan(params, function(err, data) {
           if (err) {
               console.error(err, err.stack); // an error occurred
               callback(err);
           }else{     
               console.log(data);           // successful response
               const items = data.Items.map( (dataField) => {
                   return {
                       age: +dataField.Age.N,
                       height: +dataField.Height.N,
                       income: +dataField.Income.N
                   };
               });
               callback(null, items);
           }
        });
    }else if(type === 'single'){
        var cispParams = {
          "AccessToken": accessToken  
        };
        cisp.getUser(cispParams, (err, result) => {
            if(err){
                console.log(err);
                callback(err);
            }else{
                console.log(result);
                const userId = result.UserAttributes[0].Value;
                
                params = {
            Key: {
                "UserId": {
                    S: userId
                }
            }, 
            TableName: "compare-yourself"
        };
        dynamodb.getItem(params, function(err, data) {
           if (err) {
               console.error(err, err.stack); // an error occurred
               callback(err);
           }else{     
               console.log(data);           // successful response
               var item = [{ age: +data.Item.Age.N, height: +data.Item.Height.N,income: +data.Item.Income.N}];
               callback(null, item);
           }
        });
            }
        });
        
    }else{
        callback(null, 'Something went wrong!');
    }
};
