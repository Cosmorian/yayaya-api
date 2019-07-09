import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_DDB_ACCESS_KEY,
    secretAccessKey: process.env.AWS_DDB_SECRET_KEY,
  },
});

export const ddb = new AWS.DynamoDB.DocumentClient({
  region: 'ap-northeast-2',
});

export default class DynamoEntity {
  gameId: string;
  result: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = `yayaya`;

  static async getItem(gameId: number) {
    return ddb.get({
      TableName: this.tableName,
      Key: {
        gameId,
      },
    }).promise();
  }

  static async queryIds(ids: number[]) {
    const query = { RequestItems: {} };
    query.RequestItems[this.tableName] = {
      Keys: ids.map(i => ({ gameId: i })),
      ProjectionExpression: 'gameId',
    };
    return ddb.batchGet(query).promise();
  }

  static async putItem(id: number) {
    return ddb.put({
      TableName: this.tableName,
      ConditionExpression: `attribute_not_exists(gameId)`,
      Item: {
        gameId: id,
        result: Math.floor(Math.random() * 3),
      },
    });
  }

}
