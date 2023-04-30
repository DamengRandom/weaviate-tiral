const weaviate = require("weaviate-ts-client");

require("dotenv").config();

const client = weaviate.client({
  scheme: "https",
  host: process.env.WEAVIATE_HOST_NAME,
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
  headers: {
    "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY,
  },
});

client.graphql
  .get()
  .withClassName("TheQuestion")
  .withFields("question answer category")
  .withNearText({ concepts: ["biology"] })
  .withLimit(1)
  .do()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
