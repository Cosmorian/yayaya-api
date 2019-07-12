import React, {useEffect, useState} from 'react';
import moment from 'moment';
import axios from 'axios';
import Game from "../components/Game/Game";
import GameHistory from "../components/GameHistory/GameHistory";

export async function getGames() {
  return axios.get('/api/games');
}

function useGames() {
  const [gameState, setGameState] = useState(null);
  const [games, setGames] = useState([]);
  useEffect(() => {
    getGames().then(response => {
      const { results, gameState } = response.data.data;
      setGames(results);
      setGameState(gameState);
    });
  }, []);

  useEffect(() => {
    // const interval = setInterval(async () => {
    //   const response = await getGames();
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);
  return {games, gameState};
}

export default function IndexPage() {
  const {games, gameState} = useGames();
  return (
    <div>
      <h1>
        {gameState ?
          moment(gameState.gameId).format('MM/DD/ hh:mm') : null}
      </h1>
      <div className="wrapper">

        <div className="Game">
          {gameState ?
            <Game startTime={gameState.ts} /> : null
          }
        </div>
        <div className="GameHistoryPanel">
          {games.map((game) => <GameHistory key={game.gameId} game={game}/>)}
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
        }
        .Game {
          width: 500px;
          height: 500px;
          margin-right: 24px;
        }
        .GameHistoryPanel {
          height: 500px;
          width: 200px;
          overflow: auto;
          border: 1px solid black;
        }
      `}</style>
    </div>
  )
}
