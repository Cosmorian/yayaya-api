import { getApp } from "../../app"
import DynamoEntity from "../../entity/DynamoEntity"
const app = getApp();

app.get('*', async (req, res) => {
  let { games = '' } = req.query;
  if (!games) {
    return res.status(400).json('Bad Request');
  }
  games = games
    .split(',')
    .filter(g => g)
    .map(g => Number(g));
  let yayaya = await getGames(games);
  const yayayaIds = yayaya.map(ya => (ya && ya.gameId)).filter(i => i);
  const promises = games.map((game) => {
    if (yayayaIds.indexOf(game) === -1) {
      return DynamoEntity.putItem(game);
    }
  }).filter(r => r);
  if (promises.length) {
    await Promise.all(promises);
    yayaya = await getGames(games);
  }
  res.json({ data: games });
});

async function getGames(games: number[]) {
  const { Responses: { yayaya = [] } } = await DynamoEntity.queryIds(games);
  return yayaya;
}

export default app;
