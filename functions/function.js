const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event) {
  console.log("request: ", JSON.stringify(event));
  let name = getName(event);

  try {
    // log our hello to dynamodb
    const data = await ddb.put({
      TableName: process.env.HELLO_TABLE_NAME,
      Item: {
          name: name,
          message: `Said hello to ${name}`,
      },
    }).promise();

    return sendHtmlResponse(200, `Hello ${name}!`)
  } catch(error) {
    console.error(error);
    return sendHtmlResponse(500, 'There was an unknown error.')
  }
}

const getName = (event) => {
  let name = undefined;
  if (event["queryStringParameters"] && ("name" in event["queryStringParameters"])) {
    name = event["queryStringParameters"]["name"];
  }

  if (!name) {
    name = "World";
  }
  return name;
}

const sendHtmlResponse = (status, body) => {
  return {
    statusCode: status, 
    body: body,
    headers: {
      "Content-Type": "text/html",      
    },     
  };
}

