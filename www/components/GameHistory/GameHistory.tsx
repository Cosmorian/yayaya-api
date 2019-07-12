import React from 'react';
import moment from 'moment';

export default function GameHistory({game}) {
  const { gameId, result } = game;
  return (
    <div className="GameHistory">
      <div className="Date">
        {moment(gameId).format('MM/DD/ hh:mm')}
      </div>
      <div>
        {result + 1}
      </div>
      <style jsx>{`
        .GameHistory {
          position: relative;
          display: flex;
        }
        .Date {
          width: 100px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
