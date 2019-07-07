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
  const response = await DynamoEntity.queryIds(games);
  console.log('response : ', response);
  res.json({ data: games });
});

export default app;
