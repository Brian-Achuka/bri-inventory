const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function init() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    sku TEXT,
    quantity INTEGER,
    location TEXT,
    notes TEXT
  )`);

  // seed a demo user
  const admin = await get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    await run('INSERT INTO users(username, password) VALUES(?,?)', ['admin', 'admin123']);
  }

  // seed some items if empty
  const rows = await all('SELECT * FROM items LIMIT 1');
  if (!rows || rows.length === 0) {
    await run('INSERT INTO items(name, sku, quantity, location, notes) VALUES(?,?,?,?,?)', ['Widget A', 'WID-001', 100, 'Warehouse 1', 'Top seller']);
    await run('INSERT INTO items(name, sku, quantity, location, notes) VALUES(?,?,?,?,?)', ['Widget B', 'WID-002', 50, 'Warehouse 2', 'Backorder sometimes']);
  }
}

init().catch(err => console.error('DB init error', err));

module.exports = {
  run,
  get,
  all,
  getUserByUsername: (username) => get('SELECT * FROM users WHERE username = ?', [username])
};
