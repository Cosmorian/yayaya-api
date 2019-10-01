import React from 'react';

export default function GameHistory({ start, game }) {
  const { gameId, result } = game;
  return (
    <div className="GameHistory">
      <div className="Date">
        {Math.floor((gameId - start) / 60000) + 1}
        {/*{moment(gameId).format('MM/DD/ hh:mm')}*/}
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
