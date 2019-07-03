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

export default abstract class DynamoEntity {
  gameId: string;

  static tableName = `yayaya`;

  static async getItem(id: string) {
    return ddb.get({
      TableName: this.tableName,
      Key: {
        id,
      },
    }).promise();
  }

}
