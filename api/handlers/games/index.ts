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
  const gameResult = new GameResult(roundedNow);
  const gameState = new GameState(nowS);
  const roundedToday = Time.getToday();
  await gameResult.createGameResultList(gameState);
  res.json({
    data: {
      results: gameResult.getResult(),
      gameState: {
        state: gameState,
        gameId: roundedNow,
        ts: nowTs,
      },
    },
  });
});

export default app;
