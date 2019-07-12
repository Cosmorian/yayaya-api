import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Game from "../components/Game/Game";
import GameHistory from "../components/GameHistory/GameHistory";

async function getGames() {
  return axios.get('https://yayaya.codemilli.now.sh/api/games');
}

function useGames() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getGames();
      console.log('response : ', response, games, setGames);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return games;
}

export default function IndexPage() {
  const games = useGames();
  return (
    <div>
      <Game/>
      <div className="GameHistoryPanel">
        {games.map((game) => <GameHistory game={game}/>)}
      </div>
    </div>
  )
}
