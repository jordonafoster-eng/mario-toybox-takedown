const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(__dirname, '..', 'game.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS level_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0,
    toys_collected INTEGER DEFAULT 0,
    best_time INTEGER,
    stars INTEGER DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, level_id)
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id INTEGER PRIMARY KEY,
    total_toys INTEGER DEFAULT 0,
    levels_completed INTEGER DEFAULT 0,
    total_playtime INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// User queries
const createUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
const getUserByUsername = db.prepare('SELECT * FROM users WHERE username = ?');
const getUserById = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?');

// Progress queries
const saveProgress = db.prepare(`
  INSERT INTO level_progress (user_id, level_id, completed, toys_collected, best_time, stars, completed_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(user_id, level_id) DO UPDATE SET
    completed = excluded.completed,
    toys_collected = MAX(toys_collected, excluded.toys_collected),
    best_time = MIN(COALESCE(best_time, 999999), excluded.best_time),
    stars = MAX(stars, excluded.stars),
    completed_at = excluded.completed_at
`);

const getProgress = db.prepare('SELECT * FROM level_progress WHERE user_id = ? ORDER BY level_id');
const getLevelProgress = db.prepare('SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?');

// Stats queries
const getUserStats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
const updateUserStats = db.prepare(`
  INSERT INTO user_stats (user_id, total_toys, levels_completed, total_playtime)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET
    total_toys = excluded.total_toys,
    levels_completed = excluded.levels_completed,
    total_playtime = total_playtime + excluded.total_playtime
`);

module.exports = {
  db,
  createUser,
  getUserByUsername,
  getUserById,
  saveProgress,
  getProgress,
  getLevelProgress,
  getUserStats,
  updateUserStats
};
