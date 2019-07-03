import { getApp } from "../../app"
const app = getApp();

app.get('*', async (req, res) => {
  const { games = '' } = req.query;
  if (!games) {
    res.status(400).json('Bad Request');
  }
});

export default app;
