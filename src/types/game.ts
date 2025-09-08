export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Frames {
  max: number;
  current: number;
  elapsed: number;
  hold: number;
}

export interface SpriteConfig {
  position?: Position;
  imageSrc: string;
  frames?: { max: number };
  offset?: Position;
}

export interface EnemyConfig {
  position?: Position;
}

export interface BuildingConfig {
  position: Position;
}

export interface PlacementTileConfig {
  position: Position;
}

export interface ProjectileConfig {
  position: Position;
  enemy: import('../classes/Enemy').Enemy; // Enemy class instance
}

export interface Mouse {
  x: number | undefined;
  y: number | undefined;
}

// Note: Enemy, Building, Projectile, and PlacementTile are actual classes, not interfaces
