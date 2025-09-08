import React from 'react';

interface GameWinProps {
  isVisible: boolean;
  onRestart: () => void;
}

export const GameWin: React.FC<GameWinProps> = ({ isVisible, onRestart }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-green-800 to-green-900 p-8 rounded-lg shadow-2xl text-center border-4 border-green-400">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-green-300 mb-2 animate-pulse">
            🎉 YOU WIN! 🎉
          </h1>
          <p className="text-2xl text-green-100 mb-4">
            Congratulations!
          </p>
          <p className="text-lg text-green-200 mb-2">
            You have successfully defended against all 10 waves!
          </p>
          <p className="text-md text-green-300">
            You are a true Tower Defense Master!
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="text-yellow-300 text-xl font-bold">
            🏆 VICTORY ACHIEVED 🏆
          </div>
          
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
