import React from 'react';

interface GameOverProps {
  isVisible: boolean;
  onRestart?: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ isVisible, onRestart }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="text-center">
        <div 
          className="text-7xl text-white mb-8"
          style={{ WebkitTextStroke: '3px black' }}
        >
          GAME OVER
        </div>
        {onRestart && (
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-lg transition-colors"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};
