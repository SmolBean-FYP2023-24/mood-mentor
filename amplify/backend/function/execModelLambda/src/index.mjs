/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import axios from "axios";
import { exec } from "child_process";

async function query(filename) {
  const API_URL =
    "https://api-inference.huggingface.co/models/sarthak712/emotion_detection_model";
  const headers = {
    Authorization: process.env["HUGGING_FACE_API_KEY"],
  };

  const response = await axios.get(filename, { responseType: "arraybuffer" });
  fs.writeFileSync("/tmp/audio.wav", response.data);

  const data = fs.readFileSync("/tmp/audio.wav");

  const max_retries = 5;
  const retry_delay = 5;

  for (let attempt = 0; attempt < max_retries; attempt++) {
    var res;
    var statusCode;
    await axios
      .post(API_URL, data, { headers: headers })
      .then((result) => {
        res = result;
        statusCode = result.status;
      })
      .catch(function (err) {
        res = err;
        statusCode = err.response.status;
      });
    if (statusCode === 503) {
      console.log(
        `Attempt ${
          attempt + 1
        } failed with status code 503. Retrying in ${retry_delay} seconds...`
      );
      await new Promise((r) => setTimeout(r, retry_delay * 1000));
    } else {
      exec("rm -rf /tmp/*", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
      });
      return res.data;
    }
  }
  exec("rm -rf /tmp/*", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  });
  return null;
}

async function claudeResults(prompt) {
  const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"],
  });

  const msg = await anthropic.messages.create({
    model: "claude-2.0",
    max_tokens: 1024,
    system:
      "You are an expert in identifying emotions in text. For each sentence in the prompt you must provide the associated emotion. Possible values for emotions are 'happy', 'sad', 'disguist', 'fear', 'angry', or 'neutral'.\
    <example>\
    TEXT:The warm rays of sunshine enveloped the park, casting a golden glow on the children as they gleefully chased each other, their laughter echoing through the air. In the corner of the room, a single tear silently rolled down her cheek, her gaze fixed on the empty chair that once held her beloved companion. The pungent stench emanating from the overflowing garbage cans nearby made her nose scrunch up in distaste, prompting her to quicken her pace and escape the nauseating odor. As darkness fell, the rustling leaves and distant hooting of an owl sent a shiver down her spine, causing her heart to race with an unexplained sense of unease. His clenched fists and gritted teeth revealed the anger simmering beneath the surface, his voice trembling with restrained fury as he pointed an accusatory finger. Sitting at the bus stop, she stared blankly ahead, her expression devoid of any discernible emotion, lost in her own thoughts as the world buzzed around her. Do not add any other text to your response besides responding in this way\
    OUTPUT:{'The warm rays of sunshine enveloped the park, casting a golden glow on the children as they gleefully chased each other, their laughter echoing through the air.': 'happy', 'In the corner of the room, a single tear silently rolled down her cheek, her gaze fixed on the empty chair that once held her beloved companion.': 'sad', 'The pungent stench emanating from the overflowing garbage cans nearby made her nose scrunch up in distaste, prompting her to quicken her pace and escape the nauseating odor.': 'disguist', 'As darkness fell, the rustling leaves and distant hooting of an owl sent a shiver down her spine, causing her heart to race with an unexplained sense of unease.': 'fear', 'His clenched fists and gritted teeth revealed the anger simmering beneath the surface, his voice trembling with restrained fury as he pointed an accusatory finger.': 'angry', 'Sitting at the bus stop, she stared blankly ahead, her expression devoid of any discernible emotion, lost in her own thoughts as the world buzzed around her.': 'neutral'}\
    </example>",
    messages: [
      {
        role: "user",
        content: "TEXT:" + prompt,
      },
      { role: "assistant", content: "OUTPUT:" },
    ],
  });
  return msg.content[0].text;
}

export const handler = async (event) => {
  var huggingResponse = await query(event["audio_file"]);
  var claudeResponse = await claudeResults(event["prompt"]);
  huggingResponse.push(claudeResponse);
  return huggingResponse;
};
