import React, { useState, useEffect, useCallback } from "react";

const Wordle = () => {
  // Game constants
  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const words = [
    "ace",
    "act",
    "add",
    "age",
    "aid",
    "aim",
    "air",
    "ale",
    "all",
    "and",
    "ant",
    "any",
    "ape",
    "app",
    "apt",
    "arc",
    "are",
    "arm",
    "art",
    "ash",
    "act",
    "ate",
    "awe",
    "axe",
    "bad",
    "bag",
    "ban",
    "bar",
    "bat",
    "bed",
    "bee",
    "beg",
    "bet",
    "bid",
    "big",
    "bin",
    "bug",
    "bye",
    "cap",
    "car",
    "cat",
    "cod",
    "cog",
    "dig",
    "dim",
    "dog",
    "dry",
    "egg",
    "ego",
    "far",
    "fin",
    "ham",
    "hut",
    "lie",
    "low",
    "mad",
    "map",
    "man",
    "now",
    "oak",
    "odd",
    "pad",
    "pay",
    "pen",
    "pet",
    "pin",
    "red",
    "rye",
    "sad",
    "sit",
    "shy",
    "tin",
    "wax",
  ];

  // Game state
  const [randomWord, setRandomWord] = useState("");
  const [userGuess, setUserGuess] = useState([]);
  const [turn, setTurn] = useState(1);
  const [gameBoard, setGameBoard] = useState({
    row1: ["", "", ""],
    row2: ["", "", ""],
    row3: ["", "", ""],
  });
  const [tileColors, setTileColors] = useState({
    row1: ["", "", ""],
    row2: ["", "", ""],
    row3: ["", "", ""],
  });
  const [points, setPoints] = useState(100);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintLetter, setHintLetter] = useState("");
  const [showHintModal, setShowHintModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalPoints: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    hintsUsed: 0,
    winPercentage: 0,
  });

  // Initialize game
  useEffect(() => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setRandomWord(newWord);
    console.log("New word:", newWord);
  }, []);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      checkKey(e.key);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [userGuess, turn]);

  const checkKey = useCallback(
    (key) => {
      if (alphabet.includes(key.toLowerCase())) {
        addLetter(key.toLowerCase());
      } else if (key === "Enter") {
        submitGuess();
      } else if (key === "Delete" || key === "Backspace") {
        deleteLetter();
      }
    },
    [userGuess, turn]
  );

  const addLetter = (letter) => {
    if (userGuess.length < 3) {
      const newGuess = [...userGuess, letter];
      setUserGuess(newGuess);
      updateGameBoard(newGuess);
    }
  };

  const deleteLetter = () => {
    if (userGuess.length > 0) {
      const newGuess = userGuess.slice(0, -1);
      setUserGuess(newGuess);
      updateGameBoard(newGuess);
    }
  };

  const updateGameBoard = (guess) => {
    const currentRow = `row${turn}`;
    setGameBoard((prev) => ({
      ...prev,
      [currentRow]: [guess[0] || "", guess[1] || "", guess[2] || ""],
    }));
  };

  const submitGuess = () => {
    if (userGuess.length === 3) {
      checkGuess();
      setUserGuess([]);
      setTurn((prev) => prev + 1);
    }
  };

  const checkGuess = () => {
    const guessWord = userGuess.join("");
    const currentRow = `row${turn}`;
    const newColors = [];

    // Calculate colors for each letter
    for (let i = 0; i < 3; i++) {
      if (userGuess[i] === randomWord[i]) {
        newColors[i] = "correct";
      } else if (randomWord.includes(userGuess[i])) {
        newColors[i] = "wrong-location";
      } else {
        newColors[i] = "wrong";
      }
    }

    setTileColors((prev) => ({
      ...prev,
      [currentRow]: newColors,
    }));

    // Check win/lose conditions
    if (guessWord === randomWord) {
      handleWin();
    } else if (turn === 3) {
      handleLose();
    }
  };

  const handleWin = () => {
    let finalPoints = points;
    if (turn === 2) finalPoints -= 25;
    else if (turn === 3) finalPoints -= 50;
    if (hintUsed) finalPoints -= 25;

    setPoints(finalPoints);
    setStats((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + finalPoints,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: prev.gamesWon + 1,
      winPercentage: Math.round(
        ((prev.gamesWon + 1) * 100) / (prev.gamesPlayed + 1)
      ),
    }));

    setTimeout(() => setShowWinModal(true), 1000);
  };

  const handleLose = () => {
    let finalPoints = hintUsed ? -100 : -75;

    setPoints(finalPoints);
    setStats((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + finalPoints,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesLost: prev.gamesLost + 1,
      winPercentage:
        prev.gamesPlayed + 1 > 0
          ? Math.round((prev.gamesWon * 100) / (prev.gamesPlayed + 1))
          : 0,
    }));

    setTimeout(() => setShowLoseModal(true), 1000);
  };

  const getHint = () => {
    if (!hintUsed) {
      const randomLetter =
        randomWord[Math.floor(Math.random() * randomWord.length)];
      setHintLetter(randomLetter.toUpperCase());
      setHintUsed(true);
      setShowHintModal(true);
      setStats((prev) => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
      }));
    }
  };

  const playAgain = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setRandomWord(newWord);
    console.log("New word:", newWord);

    setUserGuess([]);
    setTurn(1);
    setGameBoard({
      row1: ["", "", ""],
      row2: ["", "", ""],
      row3: ["", "", ""],
    });
    setTileColors({
      row1: ["", "", ""],
      row2: ["", "", ""],
      row3: ["", "", ""],
    });
    setPoints(100);
    setHintUsed(false);
    setHintLetter("");
    setShowWinModal(false);
    setShowLoseModal(false);
  };

  const resetStats = () => {
    setStats({
      totalPoints: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      hintsUsed: 0,
      winPercentage: 0,
    });
    setShowResetModal(false);
    playAgain();
  };

  const getTurnText = () => {
    switch (turn) {
      case 1:
        return "first";
      case 2:
        return "second";
      case 3:
        return "third";
      default:
        return "first";
    }
  };

  const Tile = ({ value, colorClass }) => (
    <div className={`tile ${colorClass}`}>{value.toUpperCase()}</div>
  );

  const KeyboardKey = ({ letter, onClick }) => (
    <button className="key letter" onClick={() => onClick(letter)}>
      {letter}
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <style jsx>{`
        .header {
          margin-top: 3rem;
          display: grid;
          grid-template-rows: repeat(1, 6rem);
          grid-template-columns: repeat(7, 6rem);
          grid-gap: 0.5rem;
        }
        .header-letter {
          font-size: 4rem;
          font-weight: 900;
          background-color: #000;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.5rem;
          transition: all 0.3s;
          user-select: none;
        }
        .header-letter:hover {
          transform: translateY(-1rem);
          background-color: #3d3db3;
        }
        .stats-small {
          width: 100%;
          height: 5rem;
          margin-top: 1.5rem;
          padding: 0 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .stats-btn {
          width: 25%;
          height: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.1rem;
          border: none;
          transition: all 0.1s;
          user-select: none;
          margin-right: 1rem;
        }
        .stats-btn:hover {
          cursor: pointer;
          filter: brightness(90%);
          transform: translateY(-0.2rem);
        }
        .stats-btn__hint {
          background-color: #3d3db3;
          color: #fff;
        }
        .stats-btn__stats {
          background-color: #df9917;
          color: #fff;
        }
        .stats-btn__rules {
          background-color: lightgray;
        }
        .btn-disabled {
          background-color: #e6e6e6;
          color: #afafaf;
        }
        .btn-disabled:hover {
          cursor: default;
          filter: brightness(100%);
          transform: translateY(0);
        }
        .hint-letter {
          position: absolute;
          top: 50%;
          left: 0;
          width: 5rem;
          height: 5rem;
          background-color: #df9917;
          border-radius: 50%;
          transform: translateX(4.5rem) translateY(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          font-weight: 600;
          color: #fff;
        }
        .grid {
          padding: 2rem;
          display: grid;
          grid-template-rows: repeat(3, 10rem);
          grid-template-columns: repeat(3, 10rem);
          grid-gap: 1rem;
        }
        .tile {
          background-color: #fff;
          border: 0.2rem solid lightgray;
          border-radius: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 5rem;
          font-weight: 900;
          text-transform: uppercase;
          user-select: none;
        }
        .correct {
          background-color: #3d3db3;
          color: #fff;
          border: none;
        }
        .wrong-location {
          background-color: #df9917;
          color: #fff;
          border: none;
        }
        .wrong {
          background-color: #292929;
          color: #fff;
          border: none;
        }
        .keyboard {
          margin: 0 auto;
          margin-bottom: 2rem;
          display: grid;
          grid-template-columns: repeat(20, 2.5rem);
          grid-template-rows: repeat(3, 5rem);
          grid-gap: 0.5rem;
        }
        .key {
          background-color: lightgray;
          border: none;
          border-radius: 0.5rem;
          text-transform: uppercase;
          font-size: 1.6rem;
          font-weight: 600;
          transition: all 0.2s;
          user-select: none;
        }
        .key:hover {
          cursor: pointer;
          filter: brightness(0.95);
        }
        .letter {
          grid-column: span 2;
        }
        .enter,
        .delete {
          grid-column: span 3;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        .modal {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          max-width: 500px;
          width: 90%;
          text-align: center;
        }
        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.25rem;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          margin: 0.5rem;
        }
        .btn-primary {
          background-color: #3d3db3;
          color: white;
        }
        .btn-secondary {
          background-color: #df9917;
          color: white;
        }
        .btn-danger {
          background-color: #ed3b3b;
          color: white;
        }
      `}</style>

      {/* Header */}
      <div className="header">
        {["T", "H", "I", "R", "D", "L", "E"].map((letter, i) => (
          <div key={i} className="header-letter">
            {letter}
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="stats-small">
        {hintLetter && <div className="hint-letter">{hintLetter}</div>}
        <button
          className={`stats-btn stats-btn__hint ${
            hintUsed ? "btn-disabled" : ""
          }`}
          onClick={getHint}
        >
          🔍 Hint
        </button>
        <button
          className="stats-btn stats-btn__stats"
          onClick={() => setShowStatsModal(true)}
        >
          📊 Stats
        </button>
        <button
          className="stats-btn stats-btn__rules"
          onClick={() => setShowRulesModal(true)}
        >
          ℹ️ Rules
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid">
        {[1, 2, 3].map((row) =>
          [0, 1, 2].map((col) => (
            <Tile
              key={`${row}-${col}`}
              value={gameBoard[`row${row}`][col]}
              colorClass={tileColors[`row${row}`][col]}
            />
          ))
        )}
      </div>

      {/* Keyboard */}
      <div className="keyboard">
        {/* First row */}
        {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((letter) => (
          <KeyboardKey key={letter} letter={letter} onClick={checkKey} />
        ))}
        <div className="key" style={{ gridColumn: "span 2" }}></div>

        {/* Second row */}
        {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((letter) => (
          <KeyboardKey key={letter} letter={letter} onClick={checkKey} />
        ))}
        <div className="key" style={{ gridColumn: "span 2" }}></div>

        {/* Third row */}
        <button
          className="key enter"
          onClick={() => checkKey("Enter")}
          style={{ gridColumn: "span 3" }}
        >
          Enter
        </button>
        {["z", "x", "c", "v", "b", "n", "m"].map((letter) => (
          <KeyboardKey key={letter} letter={letter} onClick={checkKey} />
        ))}
        <button
          className="key delete"
          onClick={() => checkKey("Delete")}
          style={{ gridColumn: "span 3" }}
        >
          Delete
        </button>
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ fontSize: "4rem", marginBottom: "2rem" }}>
              {hintLetter}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowHintModal(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {showWinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Congratulations!</h2>
            <p>
              You won! The correct word was <strong>{randomWord}</strong>.
            </p>
            <p>
              You guessed correct on your <strong>{getTurnText()} turn</strong>.
            </p>
            <p>
              You {hintUsed ? "used" : "didn't use"} your hint and received{" "}
              <strong>{points} points</strong>.
            </p>
            <div>
              <button className="btn btn-primary" onClick={playAgain}>
                🔄 Play Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowWinModal(false);
                  setShowStatsModal(true);
                }}
              >
                📊 View Stats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lose Modal */}
      {showLoseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>😩 Game Over!</h2>
            <p>
              You lost! The correct word was <strong>{randomWord}</strong>.
            </p>
            <p>
              You {hintUsed ? "used" : "didn't use"} your hint and received{" "}
              <strong>{points} points</strong>.
            </p>
            <div>
              <button className="btn btn-primary" onClick={playAgain}>
                🔄 Play Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowLoseModal(false);
                  setShowStatsModal(true);
                }}
              >
                📊 View Stats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "2rem",
              }}
              onClick={() => setShowStatsModal(false)}
            >
              ✕
            </button>
            <h2>📊 Your Statistics</h2>
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  color: "#3d3db3",
                }}
              >
                {stats.totalPoints}
              </div>
              <div>Points</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div>Won: {stats.winPercentage}%</div>
              <div>Lost: {100 - stats.winPercentage}%</div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div>Games Played: {stats.gamesPlayed}</div>
              <div>Games Won: {stats.gamesWon}</div>
              <div>Games Lost: {stats.gamesLost}</div>
              <div>Hints Used: {stats.hintsUsed}</div>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => setShowResetModal(true)}
            >
              Reset Stats
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="modal-overlay">
          <div
            className="modal"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <button
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "2rem",
              }}
              onClick={() => setShowRulesModal(false)}
            >
              ✕
            </button>
            <h2>📋 Rules</h2>
            <h3>🎯 Objective</h3>
            <p>
              The objective of Thirdle is to guess the correct 3-letter word in
              three turns or less.
            </p>
            <h3>✨ Gameplay</h3>
            <p>
              Use your keyboard or the onscreen keyboard to type a 3-letter
              word. Submit your guess by clicking Enter.
            </p>
            <p>The letters will change to one of three colors:</p>
            <p>
              <strong style={{ color: "#3d3db3" }}>Blue</strong> indicates the
              letter is in the correct place.
            </p>
            <p>
              <strong style={{ color: "#df9917" }}>Orange</strong> indicates the
              letter is in the word but wrong place.
            </p>
            <p>
              <strong style={{ color: "#292929" }}>Black</strong> indicates the
              letter is not in the word.
            </p>
            <h3>📊 Points</h3>
            <p>
              100 points for first turn, 75 for second, 50 for third, 25 if you
              fail.
            </p>
            <p>-25 point penalty for using hints.</p>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to reset your current statistics?</p>
            <div>
              <button className="btn" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={resetStats}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordle;
