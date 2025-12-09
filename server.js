const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/items', itemsRouter);

// Simple login endpoint (demo only)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.getUserByUsername(username);
    if (user && user.password === password) {
      return res.json({ success: true, username: user.username });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
