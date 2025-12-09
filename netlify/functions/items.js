const { NetlifyFunction } = require('@netlify/functions');
const db = require('./dbStore');

exports.handler = async function (event) {
  // GET: list items (optional ?q=)
  if (event.httpMethod === 'GET') {
    const q = event.queryStringParameters && event.queryStringParameters.q;
    const rows = db.listItems(q);
    return { statusCode: 200, body: JSON.stringify(rows) };
  }

  // POST: create item
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const item = db.createItem({
        name: body.name || '',
        sku: body.sku || '',
        quantity: Number(body.quantity || 0),
        location: body.location || '',
        notes: body.notes || ''
      });
      return { statusCode: 201, body: JSON.stringify(item) };
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid body' }) };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
};
