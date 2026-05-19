module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch(
      'https://detailops.ca/api/webhooks/ingest/a2336958-f9ce-458a-98a9-2d1a78620d89',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DetailOps-Webhook-Secret': process.env.DETAILOPS_WEBHOOK_SECRET,
        },
        body: JSON.stringify({ name, email, phone, message: message || '' }),
      }
    );

    if (!response.ok) throw new Error(`CRM responded with ${response.status}`);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ ok: false });
  }
};
