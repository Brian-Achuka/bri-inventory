const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/items - list items (optional ?q= search)
router.get('/', async (req, res) => {
  const q = req.query.q;
  try {
    if (q) {
      const rows = await db.all(`SELECT * FROM items WHERE name LIKE ? OR sku LIKE ? OR location LIKE ?`, [`%${q}%`, `%${q}%`, `%${q}%`]);
      return res.json(rows);
    }
    const rows = await db.all('SELECT * FROM items ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  const { name, sku, quantity = 0, location = '', notes = '' } = req.body;
  try {
    const r = await db.run('INSERT INTO items(name, sku, quantity, location, notes) VALUES(?,?,?,?,?)', [name, sku, quantity, location, notes]);
    const newItem = await db.get('SELECT * FROM items WHERE id = ?', [r.lastID]);
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  const { name, sku, quantity, location, notes } = req.body;
  try {
    await db.run('UPDATE items SET name=?, sku=?, quantity=?, location=?, notes=? WHERE id=?', [name, sku, quantity, location, notes, req.params.id]);
    const updated = await db.get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
