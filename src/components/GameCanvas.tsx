import React, { useRef, useEffect } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  width, 
  height, 
  onCanvasReady 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = width;
        canvas.height = height;
        onCanvasReady(canvas, context);
      }
    }
  }, [width, height, onCanvasReady]);

  return (
    <canvas 
      ref={canvasRef}
      className="border border-gray-300 max-w-full max-h-[80vh]"
      style={{ display: 'block' }}
    />
  );
};
