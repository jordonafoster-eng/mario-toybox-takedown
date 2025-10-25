const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const {
  createUser,
  getUserByUsername,
  getUserById,
  saveProgress,
  getProgress,
  getLevelProgress,
  getUserStats,
  updateUserStats
} = require('./server/database');

const { generateToken, authMiddleware } = require('./server/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.static('public'));

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existing = getUserByUsername.get(username);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = createUser.run(username, hashedPassword);
    const token = generateToken(result.lastInsertRowid);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      token,
      user: { id: result.lastInsertRowid, username }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Get user
    const user = getUserByUsername.get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/me', authMiddleware, (req, res) => {
  const user = getUserById.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Progress routes
app.get('/api/progress', authMiddleware, (req, res) => {
  try {
    const progress = getProgress.all(req.userId);
    const stats = getUserStats.get(req.userId) || {
      total_toys: 0,
      levels_completed: 0,
      total_playtime: 0
    };

    res.json({ progress, stats });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

app.post('/api/progress', authMiddleware, (req, res) => {
  try {
    const { levelId, completed, toysCollected, time, stars } = req.body;

    // Save level progress
    saveProgress.run(
      req.userId,
      levelId,
      completed ? 1 : 0,
      toysCollected || 0,
      time || null,
      stars || 0,
      completed ? new Date().toISOString() : null
    );

    // Update user stats
    const allProgress = getProgress.all(req.userId);
    const totalToys = allProgress.reduce((sum, p) => sum + p.toys_collected, 0);
    const levelsCompleted = allProgress.filter(p => p.completed).length;

    updateUserStats.run(req.userId, totalToys, levelsCompleted, 0);

    res.json({ success: true });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress/:levelId', authMiddleware, (req, res) => {
  try {
    const levelId = parseInt(req.params.levelId);
    const progress = getLevelProgress.get(req.userId, levelId);
    res.json({ progress: progress || null });
  } catch (error) {
    console.error('Get level progress error:', error);
    res.status(500).json({ error: 'Failed to get level progress' });
  }
});

// Serve game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mario - Toy Box Takedown server running on http://localhost:${PORT}`);
});
