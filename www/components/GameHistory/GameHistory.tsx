import React from 'react';
import moment from 'moment';

export default function GameHistory({game}) {
  const { gameId, result } = game;
  return (
    <div className="GameHistory">
      <div>
        {moment(gameId).format()}
      </div>
      <div>
        {result + 1}
      </div>
      <style jsx>{`
        .GameHistory {
          position: relative;
        }
      `}</style>
    </div>
  );
}
