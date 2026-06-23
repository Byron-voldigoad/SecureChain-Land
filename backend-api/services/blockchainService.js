const crypto = require('crypto');
const { pool } = require('./gisService');

async function getLatestHash() {
  const result = await pool.query('SELECT current_hash FROM audit_chain ORDER BY id DESC LIMIT 1');
  return result.rows.length > 0 ? result.rows[0].current_hash : '0';
}

async function addBlock(titleID, payload) {
  const previousHash = await getLatestHash();
  const currentHash = crypto
    .createHash('sha256')
    .update(titleID + JSON.stringify(payload) + previousHash)
    .digest('hex');

  await pool.query(
    'INSERT INTO audit_chain (title_id, payload, previous_hash, current_hash) VALUES ($1, $2, $3, $4)',
    [titleID, JSON.stringify(payload), previousHash, currentHash]
  );

  return currentHash;
}

module.exports = { addBlock };
