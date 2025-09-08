import React, { useState, useCallback, useRef } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameControls } from './GameControls';
import { GameOver } from './GameOver';
import { GameWin } from './GameWin';
import { useGame } from '../hooks/useGame';

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 768;

export const Game: React.FC = () => {
  const [coins, setCoins] = useState(100);
  const [hearts, setHearts] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    canvasRef.current = canvas;
    contextRef.current = context;
  }, []);

  const gameState = {
    coins,
    hearts,
    isGameOver,
    setCoins,
    setHearts,
    setIsGameOver
  };

  // Initialize game
  const gameHook = useGame(canvasRef, contextRef, gameState);

  const handleRestart = useCallback(() => {
    gameHook.resetGame();
  }, [gameHook]);

  const handleStartGame = useCallback(() => {
    gameHook.startGame();
  }, [gameHook]);

  const handlePauseGame = useCallback(() => {
    gameHook.pauseGame();
  }, [gameHook]);

  const handleResumeGame = useCallback(() => {
    gameHook.resumeGame();
  }, [gameHook]);

  const handleToggleSpeed = useCallback(() => {
    gameHook.toggleGameSpeed();
  }, [gameHook]);

  return (
    <div className="relative bg-black min-h-screen flex items-center justify-center">
      <div className="relative">
        <GameCanvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onCanvasReady={handleCanvasReady}
        />
        <GameControls
          gameStarted={gameHook.gameStarted}
          gamePaused={gameHook.gamePaused}
          onStartGame={handleStartGame}
          onPauseGame={handlePauseGame}
          onResumeGame={handleResumeGame}
          onToggleSpeed={handleToggleSpeed}
          coins={coins}
          hearts={hearts}
          wave={gameHook.currentWave}
          gameSpeed={gameHook.gameSpeed}
        />
        <GameOver isVisible={isGameOver && !gameHook.gameWon} onRestart={handleRestart} />
        <GameWin isVisible={gameHook.gameWon} onRestart={handleRestart} />
      </div>
    </div>
  );
};
