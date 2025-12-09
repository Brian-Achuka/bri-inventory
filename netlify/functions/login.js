const db = require('./dbStore');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const body = JSON.parse(event.body || '{}');
    const user = db.getUserByUsername(body.username);
    if (user && user.password === body.password) {
      return { statusCode: 200, body: JSON.stringify({ success: true, username: user.username }) };
    }
    return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid body' }) };
  }
};
