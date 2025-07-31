const express = require('express');
const router = express.Router();
const supabase = require('../supabase'); // the client from step 4

router.post('/create', async (req, res) => {
  const { name, parent_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO categories (uid, name, parent_id) VALUES ($1, $2, $3) RETURNING *',
      [req.uid, name, parent_id || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tree', async (req, res) => {
  const uid = req.uid; // Verified Firebase UID from middleware

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', uid); // or however your schema links categories to users

  if (error) return res.status(500).json({ success: false, error });

  res.json({ success: true, data });
});



router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 AND uid = $3',
      [name, req.params.id, req.uid]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM categories WHERE id = $1 AND uid = $2',
      [req.params.id, req.uid]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;