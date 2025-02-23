// TicTacToe.jsx
import { useState, useEffect } from 'react';
import { RotateCcw, X, Circle, ArrowLeft } from 'lucide-react';
import './TicTacToe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(''));
    const [turn, setTurn] = useState('X');
    const [winner, setWinner] = useState(null);
    const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
    const [gameMode, setGameMode] = useState(null);
    const [playerMark, setPlayerMark] = useState('X');
    const [showGameOptions, setShowGameOptions] = useState(true);

    // Game logic
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    useEffect(() => {
        if (gameMode === 'cpu' && turn !== playerMark && !winner) {
            const timeoutId = setTimeout(makeCPUMove, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [turn, gameMode, winner]);

    const checkWinner = (currentBoard) => {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        return null;
    };

    const checkDraw = (currentBoard) => {
        return currentBoard.every(cell => cell !== '') && !checkWinner(currentBoard);
    };

    const handleCellClick = (index) => {
        if (board[index] || winner || (gameMode === 'cpu' && turn !== playerMark)) return;

        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);

        const newWinner = checkWinner(newBoard);
        if (newWinner) {
            setWinner(newWinner);
            setScores(prev => ({ ...prev, [newWinner]: prev[newWinner] + 1 }));
            return;
        }

        if (checkDraw(newBoard)) {
            setWinner('draw');
            setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
            return;
        }

        setTurn(turn === 'X' ? 'O' : 'X');
    };

    const findBestMove = (currentBoard, mark) => {
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (!currentBoard[i]) {
                const testBoard = [...currentBoard];
                testBoard[i] = mark;
                if (checkWinner(testBoard)) {
                    return i;
                }
            }
        }

        // Try to block opponent
        const opponentMark = mark === 'X' ? 'O' : 'X';
        for (let i = 0; i < 9; i++) {
            if (!currentBoard[i]) {
                const testBoard = [...currentBoard];
                testBoard[i] = opponentMark;
                if (checkWinner(testBoard)) {
                    return i;
                }
            }
        }

        // Try to take center
        if (!currentBoard[4]) return 4;

        return -1;
    };

    const makeCPUMove = () => {
        const emptyCells = board.reduce((acc, cell, idx) =>
            !cell ? [...acc, idx] : acc, []);

        if (emptyCells.length > 0) {
            const cpuMark = playerMark === 'X' ? 'O' : 'X';
            let bestMove = findBestMove(board, cpuMark);

            if (bestMove === -1) {
                bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }

            const newBoard = [...board];
            newBoard[bestMove] = turn;
            setBoard(newBoard);

            const newWinner = checkWinner(newBoard);
            if (newWinner) {
                setWinner(newWinner);
                setScores(prev => ({ ...prev, [newWinner]: prev[newWinner] + 1 }));
                return;
            }

            if (checkDraw(newBoard)) {
                setWinner('draw');
                setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
                return;
            }

            setTurn(turn === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(''));
        setTurn('X');
        setWinner(null);
    };

    const startNewGame = (mode) => {
        setGameMode(mode);
        setShowGameOptions(false);
        resetGame();
    };

    const handleBack = () => {
        setShowGameOptions(true);
        setGameMode(null);
        setScores({ X: 0, O: 0, draw: 0 });
        resetGame();
    };

    if (showGameOptions) {
        return (
            <div className="game-container">
                <div className="game-options">
                    <h1 className="game-title">Tic Tac Toe</h1>
                    <h2 className="options-title">Choose Your Mark</h2>
                    <div className="mark-options">
                        <button
                            onClick={() => setPlayerMark('X')}
                            className={`mark-button ${playerMark === 'X' ? 'active' : ''}`}
                        >
                            X
                        </button>
                        <button
                            onClick={() => setPlayerMark('O')}
                            className={`mark-button ${playerMark === 'O' ? 'active' : ''}`}
                        >
                            O
                        </button>
                    </div>
                    <div className="game-buttons">
                        <button
                            onClick={() => startNewGame('cpu')}
                            className="mode-button"
                        >
                            vs CPU
                        </button>
                        <button
                            onClick={() => startNewGame('player')}
                            className="mode-button"
                        >
                            vs Player
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="header-container">
                <button onClick={handleBack} className="back-button">
                    <ArrowLeft /> Back
                </button>
                <h1 className="game-title">Tic Tac Toe</h1>
                <div className="spacer"></div>
            </div>

            <div className="game-board">
                <div className="board-container">
                    <div className="turn-indicator">
                        {gameMode === 'cpu' && turn !== playerMark ? (
                            "CPU's Turn"
                        ) : (
                            <>Current Turn: {turn === 'X' ? <X /> : <Circle />}</>
                        )}
                    </div>

                    <div className="board-grid">
                        {board.map((cell, i) => (
                            <button
                                key={i}
                                onClick={() => handleCellClick(i)}
                                className="cell"
                                disabled={cell || winner || (gameMode === 'cpu' && turn !== playerMark)}
                            >
                                {cell === 'X' ? <X size={48} /> : cell === 'O' ? <Circle size={48} /> : ''}
                            </button>
                        ))}
                    </div>

                    <button onClick={resetGame} className="reset-button">
                        <RotateCcw /> Reset Game
                    </button>
                </div>

                <div className="score-container">
                    <h2 className="score-title">Scores</h2>
                    <div className="score-list">
                        <div className="score-item">
                            <span>Player X:</span>
                            <span>{scores.X}</span>
                        </div>
                        <div className="score-item">
                            <span>Player O:</span>
                            <span>{scores.O}</span>
                        </div>
                        <div className="score-item">
                            <span>Draws:</span>
                            <span>{scores.draw}</span>
                        </div>
                    </div>
                </div>
            </div>

            {winner && (
                <div className="winner-modal">
                    <div className="modal-content">
                        <h2 className="winner-text">
                            {winner === 'draw' ? "It's a Draw!" : `${winner} Wins!`}
                        </h2>
                        <button onClick={resetGame} className="play-again-button">
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicTacToe;