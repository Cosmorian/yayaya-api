import { getApp } from "../../app"
import DynamoEntity from "../../entity/DynamoEntity"
const app = getApp();

function createNArray(n = 0) {
  return [...Array(n).keys()];
}

app.get('*', async (req, res) => {
  const { nowS, roundedNow } = getRoundedNow();
  const list = createNArray(20).reduce((acc, item) => {
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
    .map(g => existsIds.indexOf(g) === -1 && DynamoEntity.putItem(g))
    .filter(r => r);
  if (promises.length) {
    await Promise.all(promises);
    results = await getGames(list);
  }
  res.json({
    data: {
      results,
      gameState,
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
