// Middleware untuk mengecek apakah user adalah admin
exports.isAdmin = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.role === "admin") {
    return next(); // Lanjutkan jika admin
  }
  // Jika bukan admin, arahkan ke halaman utama atau halaman login
  res.redirect("/login");
};
