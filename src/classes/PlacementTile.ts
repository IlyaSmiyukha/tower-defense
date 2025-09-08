import type { Position, PlacementTileConfig } from '../types';

export class PlacementTile {
  position: Position;
  size: number;
  color: string;
  isOccupied: boolean;

  constructor({ position = { x: 0, y: 0 } }: PlacementTileConfig) {
    this.position = position;
    this.size = 64;
    this.color = 'rgba(255, 255, 255, 0.15)';
    this.isOccupied = false;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(context: CanvasRenderingContext2D, isActive: boolean = false): void {
    // Only show hover effect if tile is not occupied and is active
    if (!this.isOccupied) {
      if (isActive) {
        this.color = 'rgba(0, 255, 0, 0.8)'; // Bright green for active tiles
      } else {
        this.color = 'rgba(0, 255, 0, 0.2)';
      }
    } else {
      // If occupied, don't show any tile highlight
      this.color = 'transparent';
    }

    this.draw(context);
  }
}
