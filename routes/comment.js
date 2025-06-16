const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Middleware sederhana untuk memastikan user sudah login
const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// Rute untuk mengirim komentar
router.post(
  "/artikel/:slug/comments",
  isLoggedIn,
  commentController.postComment
);

// Rute BARU untuk like/unlike komentar
router.post(
  "/comments/:id/like",
  isLoggedIn,
  commentController.toggleLikeComment
);

module.exports = router;
