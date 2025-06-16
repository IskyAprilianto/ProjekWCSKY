require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const flash = require("connect-flash");

const User = require("./models/User");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comment");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Koneksi ke MongoDB berhasil."))
  .catch((err) => console.error("Koneksi MongoDB gagal:", err));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Konfigurasi Session HARUS dijalankan SEBELUM flash
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

// Inisialisasi flash SETELAH session
app.use(flash());

// Middleware global untuk menyediakan variabel ke semua view
app.use(async (req, res, next) => {
  // Variabel untuk flash messages
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");

  // Variabel untuk search query (agar tulisan di search bar tidak hilang)
  res.locals.searchQuery = req.query.q || "";

  // Variabel untuk info user
  res.locals.user = null;
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.locals.user = user;
      }
    } catch (err) {
      console.error(err);
    }
  }
  next();
});

// Menggunakan Routes
app.use("/", publicRoutes);
app.use("/", authRoutes);
app.use("/", commentRoutes);
app.use("/admin", adminRoutes);

// Server listen di 0.0.0.0 agar bisa diakses dari jaringan lokal
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server berjalan di http://localhost:${PORT} dan bisa diakses dari jaringan Anda`
  );
});
