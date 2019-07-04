import { getApp } from "../../app"
const app = getApp();

app.get('*', async (req, res) => {
  const { games = '' } = req.query;
  if (!games) {
    return res.status(400).json('Bad Request');
  }
  res.json(200);
});

export default app;
