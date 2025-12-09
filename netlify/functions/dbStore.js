// Simple in-memory data store for Netlify Functions demo
// NOTE: This store is not persistent across function invocations on Netlify.
// For production use, replace with an external DB (Supabase, Postgres, etc.).

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '..', '..', 'data', 'seed.json');
let store = { users: [], items: [], nextItemId: 1 };

function loadSeed() {
  try {
    const raw = fs.readFileSync(seedPath, 'utf8');
    const parsed = JSON.parse(raw);
    store.users = parsed.users || [];
    store.items = parsed.items || [];
    store.nextItemId = (store.items.reduce((m, it) => Math.max(m, it.id), 0) || 0) + 1;
  } catch (err) {
    // no seed file — start empty
    store = { users: [], items: [], nextItemId: 1 };
  }
}

// initialize at cold start
loadSeed();

module.exports = {
  listItems: (q) => {
    if (!q) return store.items.slice().reverse();
    const term = q.toLowerCase();
    return store.items.filter(it => (it.name||'').toLowerCase().includes(term) || (it.sku||'').toLowerCase().includes(term) || (it.location||'').toLowerCase().includes(term));
  },
  getItem: (id) => store.items.find(it => it.id === Number(id)),
  createItem: (obj) => {
    const item = Object.assign({ id: store.nextItemId++ }, obj);
    store.items.push(item);
    return item;
  },
  updateItem: (id, obj) => {
    const idx = store.items.findIndex(it => it.id === Number(id));
    if (idx === -1) return null;
    store.items[idx] = Object.assign({}, store.items[idx], obj, { id: Number(id) });
    return store.items[idx];
  },
  deleteItem: (id) => {
    const idx = store.items.findIndex(it => it.id === Number(id));
    if (idx === -1) return false;
    store.items.splice(idx, 1);
    return true;
  },
  getUserByUsername: (username) => store.users.find(u => u.username === username)
};
