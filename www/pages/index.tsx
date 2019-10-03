import React, {useEffect, useState} from 'react';
// import moment from 'moment';
import axios from 'axios';
import Game from "../components/Game/Game";
import GameHistory from "../components/GameHistory/GameHistory";
import Head from "next/head";

export async function getGames() {
  return axios.get('/api/games');
}

const store: any = {
  count: 0,
};

function useGames() {
  const [gameState, setGameState] = useState(null);
  const [games, setGames] = useState([]);
  const [start, setStart] = useState(null);
  useEffect(() => {
    store.refresh = function() {
      setGameState(null);
      getGames().then(response => {
        const { results, gameState, start } = response.data.data;
        setGames(results);
        setGameState(gameState);
        setStart(start);
      });
    };
    store.refresh();
  }, []);
  return { games, gameState, start };
}
export default function IndexPage() {
  const { start, games, gameState } = useGames();
  return (
    <div className="wrapper">
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Do+Hyeon&display=swap" rel="stylesheet"/>
      </Head>
      <div className="game-wrapper">
        <div className="Game">
          {gameState ?
            <Game store={store} startTime={gameState.gameId} /> : null
          }
        </div>
        <div className="GameHistoryPanel">
          <h2 className="HistoryTitle"> 지난회차 </h2>
          <div>
            {games.map((game) => <GameHistory key={game.gameId} start={start} game={game}/>)}
          </div>
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
          width: 622px;
          height: 445px;
        }
        .GameHistoryPanel {
          height: 438px;
          width: 210px;
          overflow: auto;
        }
        .HistoryTitle {
          margin: 0;
          padding: 12px 0;
          font-size: 30px;
          letter-spacing: 6px;
          color: white;
          text-align: center;
        }
      `}</style>
      <style jsx global>{`
        body {
          font-family: 'Do Hyeon', sans-serif;
        }
      `}</style>
    </div>
  )
}
