import { Sprite } from './Sprite';
import { Projectile } from './Projectile';
import type { Position, BuildingConfig } from '../types';
import { Enemy } from './Enemy';

export class Building extends Sprite {
  width: number;
  height: number;
  center: Position;
  projectiles: Projectile[];
  radius: number;
  target: Enemy | null;

  constructor({ position = { x: 0, y: 0 } }: BuildingConfig) {
    super({
      position,
      imageSrc: '/img/tower.png',
      offset: {
        x: 0,
        y: -80
      }
    });

    this.width = 64 * 2;
    this.height = 64;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };
    this.projectiles = [];
    this.radius = 250;
    this.target = null;
  }

  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
  }

  updateBuilding(context: CanvasRenderingContext2D): void {
    this.draw(context);
    if (this.target || (!this.target && this.frames.current !== 0)) {
      super.update();
    }

    // Slower shooting - shoot every 90 frames when target is available (~1.5 seconds)
    if (this.target && this.frames.elapsed % 70 === 0) {
      this.shoot();
    }
  }

  shoot(): void {
    if (this.target) {
      this.projectiles.push(
        new Projectile({
          position: {
            x: this.center.x - 20,
            y: this.center.y - 110
          },
          enemy: this.target
        })
      );
    }
  }
}
