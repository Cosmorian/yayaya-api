import { getApp } from "../../app"
import DynamoEntity from "../../entity/DynamoEntity"
const app = getApp();

function createNArray(n = 0) {
  return [...Array(n).keys()];
}

app.get('*', async (req, res) => {
  const { nowS, roundedNow } = getRoundedNow();
  const list = createNArray(100).reduce((acc, item) => {
    acc.arr[item] = (acc.roundedNow - (60000 * item));
    return acc;
  }, {
    arr: [],
    roundedNow,
  }).arr.reverse();
  let gameState = 'ready';
  if (nowS >= 20000) {
    gameState = nowS < 40000 ? 'onprogress' : 'done';
  }
  let results = await getGames(list);
  const existsIds = results
    .map(ya => (ya && ya.gameId))
    .filter(i => i);
  const promises = list
    .map(g => {
      if (existsIds.indexOf(g) === -1) {
        // 현재 스테이지의 게임의 상태가 done 아니면 putItem하지 않는다.
        if (g === roundedNow && gameState !== 'done') {
          return null;
        }
        return DynamoEntity.putItem(g);
      }
    })
    .filter(r => r);
  if (promises.length) {
    await Promise.all(promises);
    results = await getGames(list);
  }
  res.json({
    data: {
      results,
      gameState: {
        state: gameState,
        ts: roundedNow,
      },
    },
  });
});

function getRoundedNow() {
  const now = new Date();
  const nowTs = now.valueOf();
  const nowMs = now.getUTCMilliseconds();
  const nowS = now.getUTCSeconds() * 1000;
  const roundedNow = nowTs - nowMs - nowS;
  return {
    roundedNow,
    nowS,
  };
}

async function getGames(games: number[]) {
  const { Responses: { yayaya = [] } } = await DynamoEntity.queryIds(games);
  return yayaya;
}

export default app;
