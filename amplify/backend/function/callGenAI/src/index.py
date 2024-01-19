# import boto3
# import json
# brt = boto3.client(service_name='bedrock-runtime')


# def handler(event, context):

#     body = json.dumps({
#         "prompt": event["prompt"],
#         "maxTokens": 200,
#         "temperature": 0.5,
#         "topP": 0.5
#     })
#     modelId = 'ai21.j2-mid-v1'
#     accept = 'application/json'
#     contentType = 'application/json'

#     response = brt.invoke_model(
#         body=body,
#         modelId=modelId,
#         accept=accept,
#         contentType=contentType
#     )

#     try:
#         response_body = json.loads(response.get('body').read())
#         return {
#             'statusCode': 200,
#             'headers': {
#                 'Access-Control-Allow-Headers': '*',
#                 'Access-Control-Allow-Origin': '*',
#                 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
#             },
#             'body': json.dumps(response_body.get('completions')[0].get('data').get('text'))
#         }
#     except:
#         return {
#             'statusCode': 400,
#             'headers': {
#                 'Access-Control-Allow-Headers': '*',
#                 'Access-Control-Allow-Origin': '*',
#                 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
#             },
#             'body': "Error 400"
#         }

import http.client
import json
import os


def handler(event, context):
    conn = http.client.HTTPSConnection("hkust.azure-api.net")
    payload = json.dumps({
        "messages": [
            {
                "role": "system",
                "content": "You are an expert in identifying emotions in text. For each sentence in the prompt you must provide the associated emotion. Possible values for emotions are 'happy', 'sad', and 'neutral'. For example if the prompt says: Hi my name is Sarthak. I am glad I could meet my friends today. You need to respond as {'Hi my name is Sarthak': 'neutral', 'I am glad I could meet my friends today': 'happy'}"
            },
            {
                "role": "user",
                "content": event["prompt"]
            }
        ]
    })
    headers = {
        'api-key': os.environ['api_key'],
        'Content-Type': 'application/json'
    }
    conn.request(
        "POST", "/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15", payload, headers)
    try:
        res = conn.getresponse()
        data = res.read()
        data_dict = json.loads(data)
        content = data_dict["choices"][0]["message"]["content"]
        return {
            'statusCode': 200,
            'body': content
        }
    except Exception as e:
        return {
            'statusCode': 400,
            'body': str(e)
        }
