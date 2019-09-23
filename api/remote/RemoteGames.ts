import DynamoEntity from "../entity/DynamoEntity";

export default class RemoteGames {
  static async getGames(games: number[]) {
    const { Responses: { yayaya = [] } } = await DynamoEntity.queryIds(games);
    return yayaya;
  }
}
