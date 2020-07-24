import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const table = new dynamodb.Table(this, "Hello", {
      partitionKey: { name: "name", type: dynamodb.AttributeType.STRING },
    });

    // lambda function
    const dynamoLambda = new lambda.Function(this, "DynamoLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("functions"),
      handler: "function.handler",
      environment: {
        HELLO_TABLE_NAME: table.tableName,
      },
    });

    // permissions to lambda to dynamodb table
    table.grantReadWriteData(dynamoLambda);

    // create API gateway with one method and path
    const api = new apigw.RestApi(this, "hello-api");

    api.root
      .resourceForPath('hello')
      .addMethod("GET", new apigw.LambdaIntegration(dynamoLambda));

    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy.",
    });
  }
}
