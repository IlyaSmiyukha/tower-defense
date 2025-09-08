import { Sprite } from './Sprite';
import type { Velocity, ProjectileConfig } from '../types';
import { Enemy } from './Enemy';

export class Projectile extends Sprite {
  velocity: Velocity;
  enemy: Enemy;
  radius: number;

  constructor({ position = { x: 0, y: 0 }, enemy }: ProjectileConfig) {
    super({
      position,
      imageSrc: '' // No image needed
    });

    this.velocity = {
      x: 0,
      y: 0
    };
    this.enemy = enemy;
    this.radius = 10;
  }

  // Override draw method to draw a simple grey circle
  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(
      this.position.x + this.radius,
      this.position.y + this.radius,
      this.radius,
      0,
      Math.PI * 2
    );
    context.fillStyle = '#fff'; 
    context.fill();
    context.closePath();
  }

  updateProjectile(context: CanvasRenderingContext2D): void {
    this.draw(context);

    const angle = Math.atan2(
      this.enemy.center.y - this.position.y,
      this.enemy.center.x - this.position.x
    );

    const power = 5;
    this.velocity.x = Math.cos(angle) * power;
    this.velocity.y = Math.sin(angle) * power;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
