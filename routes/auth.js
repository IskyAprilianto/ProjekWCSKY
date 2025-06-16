const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET /login - Menampilkan halaman login
router.get("/login", authController.getLogin);

// POST /login - Memproses data login
router.post("/login", authController.postLogin);

// GET /register - Menampilkan halaman registrasi
router.get("/register", authController.getRegister);

// POST /register - Memproses data registrasi
router.post("/register", authController.postRegister);

// POST /logout - Proses logout
router.post("/logout", authController.postLogout);

module.exports = router;
