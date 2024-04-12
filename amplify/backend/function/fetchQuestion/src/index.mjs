/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

async function fetchQuestion() {
  const myHeaders = new Headers();
  myHeaders.append("Cache-Control", "no-store");
  myHeaders.append("api-key", process.env["GPT_API_KEY"]);
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    model: "gpt-35-turbo",
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content:
          'Suggest a random topic for having a decent conversation on. It should allow individuals to express emotions well. Give five guiding points as well. Only give the topic and guiding points, nothing else in your output. Format your output as a dictionary that looks like {"Topic": "Generated Topic", "Guide": String of guiding points in a numerically ordered list}',
      },
    ],
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://hkust.azure-api.net/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15",
      requestOptions
    );
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}
export const handler = async (event) => {
  const response = await fetchQuestion();
  return JSON.parse(response["choices"][0]["message"]["content"]);
};
