const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    const params = {
        Item:{
            UserId: {
                S: 'user_' + Math.random()
            },
            "Age": {
                N: event.age
            },
            "Height": {
                N: event.height
            },
            "Income": {
                N: event.income
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
            callback(null, 'Cha ching! Data successfully saved in DynamoDB!!');
        }
    });
    
};
