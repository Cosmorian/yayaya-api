import { getApp } from "../../app"
import DynamoEntity from "../../entity/DynamoEntity"
const app = getApp();

app.get('*', async (req, res) => {
  let { games = '' } = req.query;
  if (!games) {
    return res.status(400).json('Bad Request');
  }
  res.json(200);
  games = games
    .split(',')
    .filter(g => g)
    .map(g => Number(g));
  const { Responses: { yayaya = [] } } = await DynamoEntity.queryIds(games);
  const yayayaIds = yayaya.map(ya => (ya && ya.gameId)).filter(i => i);
  const promises = games.map((game) => {
    if (yayayaIds.indexOf(game) === -1) {
      console.log('game', game);
    }
  }).filter(r => r);
  console.log('responses : ', games);
  res.json({ data: games });
});

export default app;
