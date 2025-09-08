import { useEffect, useRef, useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { Enemy } from '../classes/Enemy';
import { Building } from '../classes/Building';
import { PlacementTile } from '../classes/PlacementTile';
import type { Mouse } from '../types';
import { placementTilesData } from '../placementTilesData';
import { waypoints } from '../waypoints';

interface GameState {
  coins: number;
  hearts: number;
  isGameOver: boolean;
  setCoins: (value: number | ((prev: number) => number)) => void;
  setHearts: (value: number | ((prev: number) => number)) => void;
  setIsGameOver: (value: boolean) => void;
}

export const useGame = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  contextRef: RefObject<CanvasRenderingContext2D | null>,
  gameState: GameState
) => {
  const animationIdRef = useRef<number>(0);
  const backgroundImageRef = useRef<HTMLImageElement>(new Image());

  // Local game state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [activeTile, setActiveTile] = useState<PlacementTile | null>(null);
  const [enemyCount, setEnemyCount] = useState(3);
  const [mouse, setMouse] = useState<Mouse>({ x: undefined, y: undefined });
  const [lastSpawnTime, setLastSpawnTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [currentWave, setCurrentWave] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1); // 1x or 2x speed
  const hasInitialSpawned = useRef(false);

  // Initialize placement tiles
  const [placementTiles] = useState<PlacementTile[]>(() => {
    const placementTilesData2D: number[][] = [];
    for (let i = 0; i < placementTilesData.length; i += 20) {
      placementTilesData2D.push(placementTilesData.slice(i, i + 20));
    }

    const tiles: PlacementTile[] = [];
    placementTilesData2D.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 14) {
          tiles.push(
            new PlacementTile({
              position: {
                x: x * 64,
                y: y * 64
              }
            })
          );
        }
      });
    });
    return tiles;
  });

  // Helper functions
  const spawnEnemies = useCallback((spawnCount: number) => {
    const newEnemies: Enemy[] = [];
    for (let i = 1; i < spawnCount + 1; i++) {
      const xOffset = i * 150;
      newEnemies.push(
        new Enemy({
          position: { x: waypoints[0].x - xOffset, y: waypoints[0].y }
        })
      );
    }
    // Replace enemies array instead of adding to it
    setEnemies(newEnemies);
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGamePaused(false);
    setCurrentWave(1);
    setEnemyCount(3);
    spawnEnemies(3);
    setLastSpawnTime(Date.now());
  }, [spawnEnemies]);

  const pauseGame = useCallback(() => {
    setGamePaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    setGamePaused(false);
  }, []);

  const toggleGameSpeed = useCallback(() => {
    setGameSpeed(prev => prev === 1 ? 2 : 1);
  }, []);

  const addBuilding = useCallback((position: { x: number; y: number }) => {
    if (gameState.coins >= 50) {
      gameState.setCoins(prev => prev - 50);
      const newBuilding = new Building({ position });
      setBuildings(prev => [...prev, newBuilding].sort((a, b) => a.position.y - b.position.y));

      // Mark tile as occupied
      if (activeTile) {
        activeTile.isOccupied = true;
      }
    }
  }, [gameState, activeTile]);

  const loseHearts = useCallback(() => {
    gameState.setHearts(prev => {
      const newHearts = prev - 1;
      if (newHearts <= 0) {
        gameState.setIsGameOver(true);
      }
      return newHearts;
    });
  }, [gameState]);

  // Load background image
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      backgroundImageRef.current = image;
    };
    image.src = '/img/gameMap.png';
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const backgroundImage = backgroundImageRef.current;

    if (!canvas || !context || !backgroundImage || gameState.isGameOver) {
      return;
    }

    // Clear canvas and draw background
    context.drawImage(backgroundImage, 0, 0);

    // Update enemies and buildings (only if game started and not paused)
    if (gameStarted && !gamePaused) {
      // Run game updates multiple times for speed
      for (let speedStep = 0; speedStep < gameSpeed; speedStep++) {
        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          enemy.updateEnemy(context);
        }

        // Update buildings and handle projectiles
        buildings.forEach((building) => {
          building.target = null;

          // Find valid enemies in range
          const validEnemies = enemies.filter((enemy) => {
            const xDifference = enemy.center.x - building.center.x;
            const yDifference = enemy.center.y - building.center.y;
            const distance = Math.hypot(xDifference, yDifference);
            return distance < enemy.radius + building.radius;
          });
          building.target = validEnemies[0] || null;

          // Update building animation and handle shooting
          building.updateBuilding(context);

          // Update projectiles
          for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];
            projectile.updateProjectile(context);

            const xDifference = projectile.enemy.center.x - projectile.position.x;
            const yDifference = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDifference, yDifference);

            // Check if projectile hits enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
              // Find the enemy in the current enemies array by ID
              const enemy = enemies.find((e) => e.id === projectile.enemy.id);

              if (enemy) {
                // Damage enemy directly
                enemy.health -= 20;

                if (enemy.health <= 0) {
                  // Remove enemy immediately by filtering out the ID
                  setEnemies(prev => prev.filter(e => e.id !== enemy.id));
                  gameState.setCoins(prev => prev + 25);
                }
              }

              // Remove projectile
              building.projectiles.splice(i, 1);
            }
          }
        });
      }
    } else if (gameStarted) {
      // If paused, still draw enemies but don't update them
      enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }

    // Check for enemies that reached the end after all updates
    const enemiesToRemove: string[] = []; // Store enemy IDs instead of indices
    if (gameStarted && !gamePaused) {
      enemies.forEach((enemy) => {
        // Check if enemy reached the end (limit to 1 per frame)
        if (enemy.position.x > canvas.width && enemiesToRemove.length === 0) {
          enemiesToRemove.push(enemy.id);
        }
      });
    }

    // Remove enemies that reached the end and lose hearts (only if game started and not paused)
    if (enemiesToRemove.length > 0 && gameStarted && !gamePaused) {
      setEnemies(prev => {
        // Filter out enemies by ID instead of using splice
        return prev.filter(enemy => !enemiesToRemove.includes(enemy.id));
      });

      // Lose hearts for enemies that reached the end
      loseHearts();
    }

    // Spawn new enemies if all are defeated (with a small delay to prevent issues)
    const currentTime = Date.now();
    if (enemies.length === 0 && currentTime - lastSpawnTime > 1000 && gameStarted && !gamePaused) {
      // Check if we've completed 10 waves
      if (currentWave >= 10) {
        // Player has won the game!
        setGameWon(true);
        gameState.setIsGameOver(true);
      } else {
        const newWave = currentWave + 1;
        const newEnemyCount = enemyCount + 2;
        setCurrentWave(newWave);
        setEnemyCount(newEnemyCount);
        spawnEnemies(newEnemyCount);
        setLastSpawnTime(currentTime);
      }
    }

    // Update placement tiles
    placementTiles.forEach((tile) => {
      const isActive = activeTile === tile;
      tile.update(context, isActive);
    });

    // Always draw buildings (so they appear immediately when placed)
    buildings.forEach((building) => {
      building.draw(context);
    });

    // Draw projectiles when paused (when not paused, they're drawn in updateProjectile)
    if (gamePaused && gameStarted) {
      buildings.forEach((building) => {
        building.projectiles.forEach((projectile) => {
          projectile.draw(context);
        });
      });
    }



    // Continue animation loop
    if (!gameState.isGameOver) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [canvasRef, contextRef, gameState, enemies, buildings, placementTiles, enemyCount, lastSpawnTime, gameStarted, gamePaused, currentWave, gameSpeed, loseHearts, spawnEnemies, activeTile]);

  // Start animation loop
  useEffect(() => {
    if (backgroundImageRef.current && !gameState.isGameOver) {
      animationIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate, gameState.isGameOver]);

  // Handle mouse and touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Helper function to get coordinates from event
    const getEventCoordinates = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX: number, clientY: number;

      if ('touches' in event && event.touches.length > 0) {
        // Touch event
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        // Mouse event
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        return null;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    // Helper function to find tile at coordinates
    const findTileAtCoordinates = (x: number, y: number): PlacementTile | null => {
      for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];
        if (
          x > tile.position.x &&
          x < tile.position.x + tile.size &&
          y > tile.position.y &&
          y < tile.position.y + tile.size
        ) {
          return tile;
        }
      }
      return null;
    };

    // Handle click/tap for tower placement
    const handleClickOrTap = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const coords = getEventCoordinates(event);
      if (!coords) return;

      const tile = findTileAtCoordinates(coords.x, coords.y);

      // On mobile (touch), show brief visual feedback then place tower
      if ('touches' in event) {
        if (tile && !tile.isOccupied && gameState.coins >= 50) {
          // Show green highlight briefly for visual feedback
          setActiveTile(tile);

          // Place tower after brief delay to show the green highlight
          setTimeout(() => {
            addBuilding({
              x: tile.position.x,
              y: tile.position.y
            });
            // Clear the highlight after placement
            setActiveTile(null);
          }, 100); // 100ms delay to show green highlight
        }
      } else {
        // Desktop: use existing activeTile system
        if (activeTile && !activeTile.isOccupied && gameState.coins >= 50) {
          addBuilding({
            x: activeTile.position.x,
            y: activeTile.position.y
          });
        }
      }
    };

    // Handle mouse move for desktop hover effects
    const handleMouseMove = (event: MouseEvent) => {
      const coords = getEventCoordinates(event);
      if (!coords) return;

      setMouse({ x: coords.x, y: coords.y });

      // Find active tile for hover effect (desktop only)
      const newActiveTile = findTileAtCoordinates(coords.x, coords.y);
      setActiveTile(newActiveTile);
    };

    // Handle touch move to update mouse position but not active tile
    const handleTouchMove = (event: TouchEvent) => {
      const coords = getEventCoordinates(event);
      if (!coords) return;

      setMouse({ x: coords.x, y: coords.y });
      // Clear active tile on touch move to remove any focus/selection
      setActiveTile(null);
    };

    // Add event listeners
    canvas.addEventListener('click', handleClickOrTap);
    canvas.addEventListener('touchstart', handleClickOrTap);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('click', handleClickOrTap);
      canvas.removeEventListener('touchstart', handleClickOrTap);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canvasRef, activeTile, gameState.coins, addBuilding, placementTiles]);

  return {
    enemies,
    buildings,
    activeTile,
    enemyCount,
    mouse,
    placementTiles,
    resetGame: useCallback(() => {
      setEnemies([]);
      setBuildings([]);
      setActiveTile(null);
      setEnemyCount(3);
      setMouse({ x: undefined, y: undefined });
      setGameStarted(false);
      setGamePaused(false);
      setCurrentWave(1);
      setGameWon(false);
      setGameSpeed(1);

      // Reset spawn flag so enemies can be spawned again
      hasInitialSpawned.current = false;

      // Reset placement tiles
      placementTiles.forEach(tile => {
        tile.isOccupied = false;
      });

      gameState.setCoins(100);
      gameState.setHearts(10);
      gameState.setIsGameOver(false);
    }, [placementTiles, gameState]),

    // Game control functions
    startGame,
    pauseGame,
    resumeGame,
    toggleGameSpeed,
    gameStarted,
    gamePaused,
    currentWave,
    gameSpeed,
    gameWon
  };
};
