const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    const params = {
        Item:{
            UserId: {
                S: "kjkj676jkjkjkj"
            },
            "Age": {
                N: "28"
            },
            "Height": {
                N: "72"
            },
            "Income": {
                N: "3000"
            }
        },
        TableName: "compare-yourself"
    };
    dynamodb.putItem(params, function(err, data) {
        if (err){
            console.error(err);
            callback(err);
        }else{
            console.log(data);
            callback(null, data);
        }
    });
    
};
