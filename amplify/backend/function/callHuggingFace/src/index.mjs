/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
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

export const handler = async (event) => {
  var huggingResponse = await query(event["audio_file"]);
  return huggingResponse;
};
