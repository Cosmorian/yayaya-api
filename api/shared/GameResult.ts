import Range from "./Range";
import RemoteGames from "../remote/RemoteGames";
import DynamoEntity from "../entity/DynamoEntity";
import GameState from "./GameState";

export default class GameResult {
  private readonly gameIdList: number[];
  private result: any[];

  constructor(private roundedNow: number) {
    this.gameIdList = this.createList(roundedNow);
  }

  get() {
    return this.result;
  }

  async createGameResultList(gameState: GameState) {
    this.result = await RemoteGames.getGames(this.gameIdList);
    const existsIds = this.result
      .map(ya => (ya && ya.gameId))
      .filter(i => i);
    const promises = this.gameIdList
      .filter(g => existsIds.indexOf(g) === -1)
      // 현재 스테이지의 게임의 상태가 done 아니면 putItem 하지 않는다.
      .filter(g => g === this.roundedNow && gameState.isDone())
      .map(g => DynamoEntity.putItem(g));
    if (promises.length) {
      await Promise.all(promises);
      this.result = await RemoteGames.getGames(this.gameIdList);
    }
    this.result.sort((a, b) => b.gameId - a.gameId);
    return this.result;
  }

  private createList(roundedNow: number) {
    const list = Range.create(100).map(item => roundedNow - (60000 * item));
    list.reverse();
    return list;
  }

}
