import React, {useEffect, useState} from 'react';
// import moment from 'moment';
import axios from 'axios';
import Game from "../components/Game/Game";
import GameHistory from "../components/GameHistory/GameHistory";

export async function getGames() {
  return axios.get('/api/games');
}

const store: any = {
  count: 0,
};

function useGames() {
  const [gameState, setGameState] = useState(null);
  const [games, setGames] = useState([]);
  useEffect(() => {
    store.refresh = function() {
      setGameState(null);
      getGames().then(response => {
        const { results, gameState } = response.data.data;
        setGames(results);
        setGameState(gameState);
      });
    };
    store.refresh();
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
    <div className="wrapper">
      {/*<h1>*/}
      {/*  {gameState ?*/}
      {/*    moment(gameState.gameId).format('MM/DD/ hh:mm') : null}*/}
      {/*</h1>*/}
      <div className="game-wrapper">

        <div className="Game">
          {gameState ?
            <Game store={store} startTime={gameState.gameId} /> : null
          }
        </div>
        <div className="GameHistoryPanel">
          {games.map((game) => <GameHistory key={game.gameId} game={game}/>)}
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: center;
          width: 900px;
          height: 600px;
          background-image: url('/static/images/background.png');
          
        }
        .game-wrapper {
          top: 127px;
          position: absolute;
          margin: auto;
          display: flex;
          background-image: url('/static/images/frame.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
        .Game {
          width: 640px;
          height: 445px;
        }
        .GameHistoryPanel {
          height: 445px;
          width: 210px;
          overflow: auto;
          border: 1px solid black;
        }
      `}</style>
    </div>
  )
}
