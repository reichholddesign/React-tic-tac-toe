import { useState } from "react";

function Square({ value, winClass, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className={"square " + (winClass ? "winner" : "")}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).length > 0) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else if (!xIsNext) {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner.length > 0) {
    status = "Winner: " + squares[winner[0]];
  } else if (squares.includes(null) === false) {
    status = "Tie game";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let boardSquares = [];
  for (let row = 0; row < 3; row++) {
    let boardRow = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      let addWinClass = false;
      if (winner.length > 0 && winner.indexOf(index) !== -1) {
        addWinClass = true;
      }
      boardRow.push(
        <Square
          key={"square" + index}
          winClass={addWinClass}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    boardSquares.push(
      <div key={"row" + row} className="board-row">
        {boardRow}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardSquares}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [historyOrder, setHistoryOrder] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let moveIndex = false;
    if (move !== 0 && !moveIndex) {
      squares.forEach((val, i) => {
        if (val !== history[move - 1][i]) {
          moveIndex = getCoords(i);
        }
      });
    }

    let description;
    if (move > 0) {
      description = "Go to move #" + move + " (" + moveIndex[0] + ")";
    } else {
      description = "Go to game start";
    }
    if (move === history.length - 1) {
      return (
        <li key={move}>
          You are at move #{move} ({moveIndex[0]})
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  function toggleOrder() {
    setHistoryOrder(!historyOrder);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => toggleOrder()}>Sort</button>
        <ol>{historyOrder ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function getCoords(i) {
  const boardCoords = [
    ["0,0"],
    ["0,1"],
    ["0,2"],
    ["1,0"],
    ["1,1"],
    ["1,2"],
    ["2,0"],
    ["2,1"],
    ["2,2"]
  ];
  return boardCoords[i];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}
