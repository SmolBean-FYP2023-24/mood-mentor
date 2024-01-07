import boto3
import json
brt = boto3.client(service_name='bedrock-runtime')


def lambda_handler(event, context):

    body = json.dumps({
        "prompt": event["prompt"],
        "maxTokens": 200,
        "temperature": 0.5,
        "topP": 0.5
    })
    modelId = 'ai21.j2-mid-v1'
    accept = 'application/json'
    contentType = 'application/json'

    response = brt.invoke_model(
        body=body,
        modelId=modelId,
        accept=accept,
        contentType=contentType
    )

    try:
        response_body = json.loads(response.get('body').read())
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(response_body.get('completions')[0].get('data').get('text'))
        }
    except:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': "Error 400"
        }
