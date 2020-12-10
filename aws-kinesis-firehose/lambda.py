import base64
import json
from datetime import datetime

# Incoming Event
def lambda_handler(event, context):
    output = []
    now = datetime.utcnow().isoformat()

    # Loop through records in incoming Event
    for record in event['records']:

        # Extract message
        message = json.loads(base64.b64decode(record['data']))

        # Construct output
        data_field = {
                'timestamp': now,
                'ticker_symbol': message['ticker_symbol'],
                'price': message['price']
        }
        output_record = {
                'recordId': record['recordId'],
                'result': 'Ok',
                'data': base64.b64encode(json.dumps(data_field))
        }
        output.append(output_record)

    return {'records': output}