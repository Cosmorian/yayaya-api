import {getApp} from "../../app"
import DynamoEntity from "../../entity/DynamoEntity"
import Range from "../../shared/Range";
import Time from "../../shared/Time";
import GameState from "../../shared/GameState";
import RemoteGames from "../../remote/RemoteGames";

const app = getApp();

app.get('*', async (req, res) => {
  const { nowS, nowTs, roundedNow } = Time.getRoundedNow();
  const { arr: list } = Range.create(100).reduce((acc, item) => {
    acc.arr[item] = (acc.roundedNow - (60000 * item));
    return acc;
  }, { arr: [], roundedNow });
  list.reverse();
  const gameState = new GameState(nowS);
  let results = await RemoteGames.getGames(list);
  const existsIds = results
    .map(ya => (ya && ya.gameId))
    .filter(i => i);
  const promises = list
    .map(g => {
      if (existsIds.indexOf(g) === -1) {
        // 현재 스테이지의 게임의 상태가 done 아니면 putItem 하지 않는다.
        if (g === roundedNow && gameState.isDone()) {
          return null;
        }
        return DynamoEntity.putItem(g);
      }
    })
    .filter(r => r);
  if (promises.length) {
    await Promise.all(promises);
    results = await RemoteGames.getGames(list);
  }
  results.sort((a, b) => b.gameId > a.gameId ? 1 : -1);
  res.json({
    data: {
      results,
      gameState: {
        state: gameState,
        gameId: roundedNow,
        ts: nowTs,
      },
    },
  });
});

export default app;
