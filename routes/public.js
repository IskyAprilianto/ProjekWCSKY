const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

// Rute Halaman Utama
router.get("/", publicController.getHomepage);

// Rute Halaman Detail Artikel
router.get("/artikel/:slug", publicController.getArticleBySlug);

// Rute untuk menangani pencarian
router.get("/search", publicController.searchArticles);

module.exports = router;
