import React from 'react';

interface GameControlsProps {
  gameStarted: boolean;
  gamePaused: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onToggleSpeed: () => void;
  coins: number;
  hearts: number;
  wave: number;
  gameSpeed: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  gamePaused,
  onStartGame,
  onPauseGame,
  onResumeGame,
  onToggleSpeed,
  coins,
  hearts,
  wave,
  gameSpeed
}) => {
  return (
    <div className="fixed top-0 left-0 right-0  flex flex-col md:flex-row flex-wrap items-center justify-between px-6 pt-6 gap-4">
      {/* Left side - Game controls */}
      <div className="flex items-center space-x-4 ">
        {!gameStarted ? (
          <button
            onClick={onStartGame}
            className="p-2 md:px-6 whitespace-nowrap py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors md:text-sm"
          >
            ▶ START GAME
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="text-white md:text-lg font-bold whitespace-nowrap">
              Wave {wave}
            </div>

            {/* Play/Pause Controls */}
            <div className="flex items-center space-x-2">
              {gamePaused ? (
                <button
                  onClick={onResumeGame}
                  className="p-2 md:px-6 whitespace-nowrap py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center"
                >
                  ▶ RESUME
                </button>
              ) : (
                <button
                  onClick={onPauseGame}
                  className="p-2 md:px-6 whitespace-nowrap py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors flex items-center"
                >
                  ⏸ PAUSE
                </button>
              )}

              {/* Pause indicator */}
              {gamePaused && (
                <div className="text-yellow-400 text-lg font-bold animate-pulse">
                  PAUSED
                </div>
              )}

              {/* Speed Control */}
              <button
                onClick={onToggleSpeed}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors text-sm"
              >
                {gameSpeed}x
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Game stats */}
      <div className="flex items-center space-x-6">
        {/* Coins */}
        <div className="flex items-center text-white text-2xl font-bold" 
             style={{ WebkitTextStroke: '1px black' }}>
            ${coins}
        </div>
        
        {/* Hearts */}
        <div className="flex items-center text-white text-2xl font-bold"
             style={{ WebkitTextStroke: '1px black' }}>
          <span className="text-red-500 mr-2 text-xl">❤️</span>
          <span>{hearts}</span>
        </div>
      </div>
    </div>
  );
};
