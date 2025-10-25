# Mario - Toy Box Takedown

A colorful puzzle-platformer game where Mario must retrieve his stolen toys from Donkey Kong in a futuristic robot-dominated world!

## Story

Donkey Kong has stolen all of Mario's toys! Help Mario navigate through futuristic robot factories and platforms to collect all his toys and reach the goal in each level.

## Features

- **5 Unique Levels**: Progress through increasingly challenging puzzle-platformer levels
- **User Authentication**: Create an account to save your progress
- **Progress Tracking**: Track your toy collection, completion times, and stars
- **Level Replay**: Replay any completed level to improve your score
- **Star System**: Earn up to 3 stars per level based on completion time
- **Mobile-Friendly**: Play on desktop or mobile with touch controls
- **Colorful Futuristic Theme**: Vibrant neon colors and robot-themed environments

## Gameplay

- **Movement**: Arrow keys or WASD to move left/right
- **Jump**: Up arrow or W key to jump
- **Mobile**: Swipe left/right to move, swipe up to jump
- **Objective**: Collect all toys in the level, then reach the green goal circle
- **Obstacles**: Avoid red robot enemies that patrol the levels
- **Switches**: Activate purple switches to unlock new platforms
- **Moving Platforms**: Time your jumps to ride the moving platforms

## Level Overview

1. **Tutorial: Robot Factory** - Learn the basics
2. **The Assembly Line** - Navigate automated production floors
3. **Conveyor Chaos** - Master moving platforms
4. **Switch Station** - Solve switch puzzles
5. **DK's Tower Challenge** - Climb to the top and face the ultimate challenge!

## Installation & Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. Create an account and start playing!

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Phaser 3
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT with bcrypt password hashing

## Game Controls

### Desktop
- **Left/Right**: Arrow keys or A/D
- **Jump**: Up arrow or W
- **Menu Navigation**: Mouse click

### Mobile
- **Move**: Touch and drag left/right
- **Jump**: Swipe up
- **Menu Navigation**: Tap

## Database Schema

- **users**: User accounts (username, hashed password)
- **level_progress**: Individual level completion data
- **user_stats**: Overall player statistics

## API Endpoints

- `POST /api/register` - Create new account
- `POST /api/login` - Login to account
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user
- `GET /api/progress` - Get all progress
- `POST /api/progress` - Save level progress
- `GET /api/progress/:levelId` - Get specific level progress

## Development

The game is built with:
- Phaser 3 for game engine and physics
- Express for REST API backend
- SQLite for data persistence
- JWT for secure authentication

## Deployment

This app uses SQLite with `better-sqlite3`, which requires a **persistent filesystem**.

### ✅ Compatible Platforms:
- **Railway** (Recommended) - [railway.app](https://railway.app)
- **Render** - [render.com](https://render.com)
- **Heroku** (with paid dyno)
- **DigitalOcean App Platform**
- **AWS EC2, Google Cloud VM, Azure VM**
- **Any VPS with Node.js**

### ❌ NOT Compatible:
- **Vercel** - Serverless, no persistent filesystem
- **Netlify** - Serverless, no persistent filesystem
- **AWS Lambda** - Serverless, no persistent filesystem

### Quick Deploy to Railway:
1. Push your code to GitHub (already done!)
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `mario-toybox-takedown`
5. Railway will automatically detect and deploy your app
6. Your game will be live in minutes!

### Quick Deploy to Render:
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will use the `render.yaml` configuration
5. Click "Create Web Service"

### Environment Variables (Optional):
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Custom JWT secret (recommended for production)

## Future Enhancements

- More levels
- Multiplayer race mode
- Leaderboards
- Power-ups and special abilities
- Boss battles with Donkey Kong
- Level editor

## License

ISC

## Credits

Created as a fun puzzle-platformer inspired by Mario vs Donkey Kong and classic arcade games!
