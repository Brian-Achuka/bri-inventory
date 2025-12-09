let API_BASE = '/';

const api = (path, opts = {}) => {
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const full = base + path;
  return fetch(full, opts).then(r => r.json());
};

const $ = id => document.getElementById(id);

function showApp() {
  $('loginBox').style.display = 'none';
  $('app').style.display = '';
  loadItems();
}

function showLogin() {
  $('loginBox').style.display = '';
  $('app').style.display = 'none';
}

async function login() {
  const username = $('username').value.trim();
  const password = $('password').value.trim();
  try {
    const res = await api('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (res && res.success) {
      localStorage.setItem('bri_user', res.username);
      showApp();
    } else {
      $('loginMsg').textContent = res.message || 'Login failed';
    }
  } catch (err) {
    $('loginMsg').textContent = 'Server error';
  }
}

async function loadItems(q = '') {
  const url = q ? `/api/items?q=${encodeURIComponent(q)}` : '/api/items';
  const rows = await api(url);
  const tbody = $('itemsTbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.id}</td><td>${r.name}</td><td>${r.sku}</td><td>${r.quantity}</td><td>${r.location}</td><td>${r.notes||''}</td><td><button data-id="${r.id}" class="edit">Edit</button> <button data-id="${r.id}" class="del">Delete</button></td>`;
    tbody.appendChild(tr);
  });
  document.querySelectorAll('.edit').forEach(b => b.addEventListener('click', onEdit));
  document.querySelectorAll('.del').forEach(b => b.addEventListener('click', onDelete));
}

function onEdit(e) {
  const id = e.target.dataset.id;
  fetch((API_BASE.endsWith('/') ? API_BASE.slice(0,-1) : API_BASE) + `/api/items/${id}`).then(r => r.json()).then(item => {
    $('itemId').value = item.id;
    $('itemName').value = item.name;
    $('itemSku').value = item.sku;
    $('itemQty').value = item.quantity;
    $('itemLoc').value = item.location;
    $('itemNotes').value = item.notes;
  });
}

function onDelete(e) {
  const id = e.target.dataset.id;
  if (!confirm('Delete item?')) return;
  fetch((API_BASE.endsWith('/') ? API_BASE.slice(0,-1) : API_BASE) + `/api/items/${id}`, { method: 'DELETE' }).then(() => loadItems());
}

async function saveItem() {
  const id = $('itemId').value;
  const payload = {
    name: $('itemName').value,
    sku: $('itemSku').value,
    quantity: parseInt($('itemQty').value || '0', 10),
    location: $('itemLoc').value,
    notes: $('itemNotes').value
  };
  if (id) {
    await fetch((API_BASE.endsWith('/') ? API_BASE.slice(0,-1) : API_BASE) + `/api/items/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } else {
    await fetch((API_BASE.endsWith('/') ? API_BASE.slice(0,-1) : API_BASE) + '/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  }
  clearForm();
  loadItems();
}

function clearForm() {
  $('itemId').value = '';
  $('itemName').value = '';
  $('itemSku').value = '';
  $('itemQty').value = '';
  $('itemLoc').value = '';
  $('itemNotes').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Load runtime config (allows frontend on Netlify to point to remote backend)
  fetch('/config.json').then(r => r.json()).then(cfg => {
    if (cfg && cfg.API_BASE) API_BASE = cfg.API_BASE;

    $('loginBtn').addEventListener('click', login);
    $('guestBtn').addEventListener('click', () => { localStorage.setItem('bri_user', 'guest'); showApp(); });
    $('logoutBtn').addEventListener('click', () => { localStorage.removeItem('bri_user'); showLogin(); });
    $('searchBtn').addEventListener('click', () => loadItems($('search').value));
    $('saveItemBtn').addEventListener('click', saveItem);
    $('clearBtn').addEventListener('click', clearForm);

    if (localStorage.getItem('bri_user')) showApp();
  }).catch(() => {
    // fallback
    $('loginBtn').addEventListener('click', login);
    $('guestBtn').addEventListener('click', () => { localStorage.setItem('bri_user', 'guest'); showApp(); });
    $('logoutBtn').addEventListener('click', () => { localStorage.removeItem('bri_user'); showLogin(); });
    $('searchBtn').addEventListener('click', () => loadItems($('search').value));
    $('saveItemBtn').addEventListener('click', saveItem);
    $('clearBtn').addEventListener('click', clearForm);
    if (localStorage.getItem('bri_user')) showApp();
  });
});
