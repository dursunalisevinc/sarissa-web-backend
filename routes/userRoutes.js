const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const pool = require('../db');

// GET /api/users - Tüm kullanıcıları getir (sadece admin)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Kullanıcılar getirilemedi: ' + err.message });
    }
});

module.exports = router;
