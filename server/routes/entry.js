const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/create', async (req, res) => {
  const { category_id, title, content } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO entries (uid, category_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.uid, category_id, title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:categoryId', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM entries WHERE uid = $1 AND category_id = $2',
      [req.uid, req.params.categoryId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.query(
      'UPDATE entries SET title = $1, content = $2 WHERE id = $3 AND uid = $4',
      [title, content, req.params.id, req.uid]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM entries WHERE id = $1 AND uid = $2',
      [req.params.id, req.uid]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;