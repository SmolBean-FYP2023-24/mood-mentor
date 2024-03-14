import http.client
import json
import os
import requests
from subprocess import call


def query(filename):
    response = requests.get(filename)
    open("/tmp/audio.wav", "wb").write(response.content)
    API_URL = "https://api-inference.huggingface.co/models/sarthak712/my_awesome_model"
    headers = {"Authorization": os.environ['model_auth']}
    with open("/tmp/audio.wav", "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    call('rm -rf /tmp/*', shell=True)
    return response.json()


def gptResult(prompt):
    conn = http.client.HTTPSConnection("hkust.azure-api.net")
    payload = json.dumps({
        "messages": [
            {
                "role": "system",
                "content": "You are an expert in identifying emotions in text. For each sentence in the prompt you must provide the associated emotion. Possible values for emotions are 'happy', 'sad', 'disguist', 'fear', 'angry', or 'neutral'. For example if the prompt says: The warm rays of sunshine enveloped the park, casting a golden glow on the children as they gleefully chased each other, their laughter echoing through the air. In the corner of the room, a single tear silently rolled down her cheek, her gaze fixed on the empty chair that once held her beloved companion. The pungent stench emanating from the overflowing garbage cans nearby made her nose scrunch up in distaste, prompting her to quicken her pace and escape the nauseating odor. As darkness fell, the rustling leaves and distant hooting of an owl sent a shiver down her spine, causing her heart to race with an unexplained sense of unease. His clenched fists and gritted teeth revealed the anger simmering beneath the surface, his voice trembling with restrained fury as he pointed an accusatory finger. Sitting at the bus stop, she stared blankly ahead, her expression devoid of any discernible emotion, lost in her own thoughts as the world buzzed around her. Do not add any other text to your response besides responding in this way - {'The warm rays of sunshine enveloped the park, casting a golden glow on the children as they gleefully chased each other, their laughter echoing through the air.': 'happy', 'In the corner of the room, a single tear silently rolled down her cheek, her gaze fixed on the empty chair that once held her beloved companion.': 'sad', 'The pungent stench emanating from the overflowing garbage cans nearby made her nose scrunch up in distaste, prompting her to quicken her pace and escape the nauseating odor.': 'disguist', 'As darkness fell, the rustling leaves and distant hooting of an owl sent a shiver down her spine, causing her heart to race with an unexplained sense of unease.': 'fear', 'His clenched fists and gritted teeth revealed the anger simmering beneath the surface, his voice trembling with restrained fury as he pointed an accusatory finger.': 'angry', 'Sitting at the bus stop, she stared blankly ahead, her expression devoid of any discernible emotion, lost in her own thoughts as the world buzzed around her.': 'neutral'}"
            },
            {
                "role": "user",
                "content": prompt
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


def handler(event, context):
    res1 = query(event['audio_file'])
    res2 = gptResult(event['prompt'])
    res1.append(res2)
    return res1
