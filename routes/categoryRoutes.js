const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Ana kategori ekleme
router.post('/add-main-category', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        // Kategori adı kontrolü
        if (!name) {
            return res.status(400).json({ message: 'Kategori adı gereklidir' });
        }

        // Ana kategoriyi veritabanına ekle
        const mainCategory = await db.MainCategory.create({ name });

        // Başarı durumu
        return res.status(201).json({
            message: 'Ana kategori başarıyla eklendi',
            mainCategory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Bir hata oluştu' });
    }
});

// Normal kategori ekleme (ana kategoriye bağlı)
router.post('/add-category', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, main_category_id } = req.body;

        if (!name || !main_category_id) {
            return res.status(400).json({ message: 'Kategori adı ve ana kategori ID\'si gereklidir' });
        }

        // Ana kategori var mı kontrol et
        const mainCategory = await db.MainCategory.findByPk(main_category_id);
        if (!mainCategory) {
            return res.status(404).json({ message: 'Ana kategori bulunamadı' });
        }

        const category = await db.Category.create({
            name,
            main_category_id,
        });

        return res.status(201).json({ message: 'Kategori başarıyla eklendi', category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Bir hata oluştu' });
    }
});


// Alt kategori ekleme (kategoriye bağlı)
router.post('/add-sub-category', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, main_category_id, parent_category_id } = req.body;

        if (!name || !main_category_id || !parent_category_id) {
            return res.status(400).json({ message: 'Kategori adı, ana kategori ID\'si ve üst kategori ID\'si gereklidir' });
        }

        // Ana kategori var mı kontrol et
        const mainCategory = await db.MainCategory.findByPk(main_category_id);
        if (!mainCategory) {
            return res.status(404).json({ message: 'Ana kategori bulunamadı' });
        }

        // Üst kategori var mı kontrol et
        const parentCategory = await db.Category.findByPk(parent_category_id);
        if (!parentCategory) {
            return res.status(404).json({ message: 'Üst kategori bulunamadı' });
        }

        const subCategory = await db.Category.create({
            name,
            main_category_id,
            parent_category_id,
        });

        return res.status(201).json({ message: 'Alt kategori başarıyla eklendi', subCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Bir hata oluştu' });
    }
});


// GET İSTEKLER

// Ana kategorileri listeleme
router.get('/get-main-categories', verifyToken, isAdmin, async (req, res) => {
    try {
        const mainCategories = await db.MainCategory.findAll();
        return res.status(200).json({ message: 'Ana kategoriler başarıyla listelendi', mainCategories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Bir hata oluştu' });
    }
});


// Belirli bir ana kategoriye ait kategorileri listeleme
router.get('/get-categories/:mainCategoryId', verifyToken, async (req, res) => {
    try {
        const { mainCategoryId } = req.params;
        const categories = await db.Category.findAll({
            where: { main_category_id: mainCategoryId },
        });

        if (!categories.length) {
            return res.status(404).json({ message: 'Bu ana kategoriye ait kategori bulunamadı' });
        }

        return res.status(200).json({ message: 'Kategori listesi başarıyla alındı', categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Bir hata oluştu' });
    }
});


// Belirli bir kategoriye ait alt kategorileri listeleme
router.get('/get-sub-categories/:categoryId', verifyToken, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const subCategories = await db.Category.findAll({
            where: { parent_category_id: categoryId },
        });

        if (!subCategories.length) {
            return res.status(404).json({ message: 'Bu kategoriye ait alt kategori bulunamadı' });
        }

        return res.status(200).json({ message: 'Alt kategori listesi başarıyla alındı', subCategories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Bir hata oluştu' });
    }
});



module.exports = router;
