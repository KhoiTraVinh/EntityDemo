const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {db: {endpoint, region}} = require('../configs/config.dynamodb');
class DynamoDBSingleton {
  static instance = null;

  constructor() {
    if (!DynamoDBSingleton.instance) {
      DynamoDBSingleton.instance = new DynamoDBClient({
        endpoint: endpoint,
        region: region,
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
