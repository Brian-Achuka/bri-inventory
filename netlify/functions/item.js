const db = require('./dbStore');

exports.handler = async function (event) {
  const id = (event.queryStringParameters && event.queryStringParameters.id) || null;
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };

  if (event.httpMethod === 'GET') {
    const it = db.getItem(id);
    if (!it) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
    return { statusCode: 200, body: JSON.stringify(it) };
  }

  if (event.httpMethod === 'PUT') {
    try {
      const body = JSON.parse(event.body || '{}');
      const updated = db.updateItem(id, {
        name: body.name, sku: body.sku, quantity: Number(body.quantity || 0), location: body.location, notes: body.notes
      });
      if (!updated) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
      return { statusCode: 200, body: JSON.stringify(updated) };
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid body' }) };
    }
  }

  if (event.httpMethod === 'DELETE') {
    const ok = db.deleteItem(id);
    return { statusCode: 200, body: JSON.stringify({ success: ok }) };
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
};
