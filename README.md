# 🏰 Tower Defense Game

A modern, responsive tower defense game built with React, TypeScript, and HTML5 Canvas. Defend your base against waves of enemies by strategically placing towers along their path.

![Tower Defense Game](https://img.shields.io/badge/Game-Tower%20Defense-green) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)

## 🎮 Game Features

- **10 Progressive Waves** - Each wave spawns more enemies with increasing difficulty
- **Strategic Tower Placement** - Place towers on designated green tiles
- **Real-time Combat** - Towers automatically target and shoot at enemies
- **Resource Management** - Earn coins by defeating enemies, spend them on towers
- **Speed Control** - Toggle between 1x and 2x game speed
- **Mobile Friendly** - Touch controls for mobile devices
- **Responsive Design** - Works on desktop and mobile screens

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tower-defense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Play

1. **Start the Game** - Click "START GAME" to begin
2. **Place Towers** - Click/tap on bright green tiles to place towers (costs 50 coins)
3. **Defend** - Towers automatically shoot at enemies in range
4. **Survive** - Prevent enemies from reaching the end of the path
5. **Progress** - Complete all 10 waves to win!

### Game Controls

- **Desktop**: Hover over tiles to highlight, click to place towers
- **Mobile**: Tap directly on tiles to place towers immediately
- **Pause/Resume**: Use the pause button during gameplay
- **Speed Toggle**: Switch between 1x and 2x speed

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.1** - UI framework with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript
- **HTML5 Canvas** - High-performance 2D graphics rendering
- **Vite 7.1.2** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Custom CSS** - Game-specific styling and animations
- **Google Fonts** - Changa One font for game aesthetics

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting rules
- **React Hooks ESLint** - React hooks best practices
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── classes/           # Game entity classes
│   ├── Building.ts    # Tower/building logic
│   ├── Enemy.ts       # Enemy behavior and movement
│   ├── PlacementTile.ts # Tower placement areas
│   ├── Projectile.ts  # Bullet/projectile physics
│   └── Sprite.ts      # Base sprite class
├── components/        # React components
│   ├── Game.tsx       # Main game component
│   ├── GameCanvas.tsx # Canvas wrapper
│   ├── GameControls.tsx # UI controls
│   ├── GameOver.tsx   # Game over screen
│   └── GameWin.tsx    # Victory screen
├── hooks/             # Custom React hooks
│   └── useGame.ts     # Main game logic hook
├── types/             # TypeScript type definitions
│   ├── game.ts        # Game-related interfaces
│   └── index.ts       # Type exports
├── placementTilesData.ts # Tower placement grid data
├── waypoints.ts       # Enemy path coordinates
├── App.tsx           # Root component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## 🎨 Game Mechanics

### Tower System
- **Cost**: 50 coins per tower
- **Targeting**: Automatic enemy detection within range
- **Damage**: 20 damage per shot
- **Rate of Fire**: Affected by game speed multiplier

### Enemy System
- **Health**: Enemies have health points
- **Movement**: Follow predefined waypoints
- **Rewards**: 25 coins per enemy defeated
- **Waves**: Each wave spawns 2 additional enemies

### Economy
- **Starting Resources**: 100 coins, 10 hearts
- **Income**: Earn coins by defeating enemies
- **Expenses**: Spend coins on tower placement
- **Lives**: Lose 1 heart per enemy that reaches the end

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project uses strict TypeScript configuration and comprehensive ESLint rules:
- No unused variables or imports
- Strict type checking
- React hooks best practices
- Modern ES2022+ features

## 🌟 Key Features Implementation

### Mobile-First Design
- Touch event handling for mobile devices
- Responsive UI that works on all screen sizes
- Immediate tower placement on touch (no hover required)

### Performance Optimizations
- Canvas-based rendering for smooth 60fps gameplay
- Efficient collision detection algorithms
- Optimized React re-renders with proper dependency arrays

### Game Balance
- Progressive difficulty scaling
- Strategic resource management
- Multiple game speed options for different play styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy defending your tower!** 🏰⚔️
