import {getApp} from "../../app"
import DynamoEntity from "../../entity/DynamoEntity"
import Range from "../../shared/Range";
import Time from "../../shared/Time";
import GameState from "../../shared/GameState";
import RemoteGames from "../../remote/RemoteGames";
import GameResult from "../../shared/GameResult";

const app = getApp();

app.get('*', async (req, res) => {
  const { nowS, nowTs, roundedNow } = Time.getRoundedNow();
  const roundedToday = Time.getToday();
  const gameResult = new GameResult(roundedNow);
  const gameState = new GameState(nowS);
  const order = Math.floor((nowTs - roundedToday) / (60 * 1000));
  await gameResult.createGameResultList(gameState);
  res.json({
    data: {
      order,
      results: gameResult.get(),
      gameState: {
        state: gameState,
        gameId: roundedNow,
        ts: nowTs,
      },
    },
  });
});

export default app;
