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

let classObj = {
  class: "TheQuestion",
  vectorizer: "text2vec-openai",
};

client.schema
  .classCreator()
  .withClass(classObj)
  .do()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

async function getJsonData() {
  const file = await fetch(
    "https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json"
  );

  return file.json();
}

async function importQuestions() {
  const data = await getJsonData();

  let batcher = client.batch.objectsBatcher();
  let counter = 0;
  let batchSize = 100;

  data.forEach((question) => {
    const obj = {
      class: "TheQuestion",
      properties: {
        answer: question.Answer,
        question: question.Question,
        category: question.Category,
      },
    };

    batcher = batcher.withObject(obj);

    if (counter++ === batchSize) {
      batcher
        .do()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });

      counter = 0;

      batcher = client.batch.objectsBatcher();
    }
  });

  batcher
    .do()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

importQuestions();
