exports.handler = async function (event) {
  console.log("request: ", JSON.stringify(event));
  
  // spit out the environment var we passed in
  console.log('HELLO_TABLE_NAME: ', process.env.HELLO_TABLE_NAME);

  return sendRes(200, "Hello Jenna!");
}

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "text/html",      
    },
    body: body,
  };
  return response;
};