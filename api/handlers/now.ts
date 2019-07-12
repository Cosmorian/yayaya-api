import { getApp } from "../app"
const app = getApp();

app.get('*', async (req, res) => res.json({data: Date.now()}));

export default app;
