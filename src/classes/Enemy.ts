import { Sprite } from './Sprite';
import type { Position, Velocity, EnemyConfig } from '../types';
import { waypoints } from '../waypoints';

export class Enemy extends Sprite {
  id: string;
  width: number;
  height: number;
  waypointIndex: number;
  center: Position;
  radius: number;
  health: number;
  velocity: Velocity;

  constructor({ position = { x: 0, y: 0 } }: EnemyConfig) {
    super({
      position,
      imageSrc: '/img/orc.png',

    });

    this.id = crypto.randomUUID();
    this.position = position;
    this.width = 100;
    this.height = 100;
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };
    this.radius = 50;
    this.health = 100;
    this.velocity = {
      x: 0,
      y: 0
    };
  }

  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);

    // health bar
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y - 15, this.width, 10);

    context.fillStyle = 'green';
    context.fillRect(
      this.position.x,
      this.position.y - 15,
      (this.width * this.health) / 100,
      10
    );
  }

  updateEnemy(context: CanvasRenderingContext2D): void {
    this.draw(context);
    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    const speed = 3;

    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };

    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
        Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
        Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}
