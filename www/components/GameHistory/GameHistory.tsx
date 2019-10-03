import React from 'react';

export default function GameHistory({ start, game }) {
  const { gameId, result } = game;
  const arr = [...Array(3).keys()];
  return (
    <div className="GameHistory">
      <div className="Date">
        {Math.floor((gameId - start) / 60000) + 1}
      </div>
      <div className="Result">
        {arr.map((i) =>
          <img src={`/static/images/cup${i === result ? '-with-stone' : ''}.png`} alt="cup"/>)}
      </div>
      <style jsx>{`
        .GameHistory {
          position: relative;
          display: flex;
        }
        .Date {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          padding: 4px 2px;
          font-size: 24px;
          color: white;
        }
        .Result {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-grow: 2;
          padding-right: 12px;
        }
        .Result img {
          width: 28px;
        }
      `}</style>
    </div>
  );
}
