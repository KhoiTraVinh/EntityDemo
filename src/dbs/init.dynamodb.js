const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
class DynamoDBSingleton {
  static instance = null;

  constructor() {
    if (!DynamoDBSingleton.instance) {
      DynamoDBSingleton.instance = new DynamoDBClient({
        endpoint: 'http://localhost:8000',
        region: 'us-west-2',
        credentials: {
          accessKeyId: "fakeKey",
          secretAccessKey: "fakeSecret"
        }
      });
    }
  }

  static getInstance() {
    if (!DynamoDBSingleton.instance) {
      new DynamoDBSingleton();
    }
    return DynamoDBSingleton.instance;
  }
}

module.exports = DynamoDBSingleton.getInstance();
