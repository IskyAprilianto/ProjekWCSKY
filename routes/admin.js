const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Rute Artikel
router.get("/dashboard", isAdmin, adminController.getDashboard);
router.get("/articles/new", isAdmin, adminController.getAddArticlePage);
router.post(
  "/articles",
  isAdmin,
  upload.single("image"),
  adminController.postAddArticle
);
router.get("/edit/:id", isAdmin, adminController.getEditArticle);
router.put(
  "/edit/:id",
  isAdmin,
  upload.single("image"),
  adminController.postEditArticle
);
router.delete("/delete/:id", isAdmin, adminController.deleteArticle);

// Rute Kategori
router.get("/categories", isAdmin, adminController.getManageCategoriesPage);
router.post("/categories", isAdmin, adminController.postAddCategory);
router.delete(
  "/categories/delete/:id",
  isAdmin,
  adminController.deleteCategory
);
// Rute Komentar
router.get("/comments", isAdmin, adminController.getManageCommentsPage);
router.delete("/comments/delete/:id", isAdmin, adminController.deleteComment);

module.exports = router;
