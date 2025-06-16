const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getRegister = (req, res) => {
  res.render("register", { title: "Register Akun" });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Ambil data, tanpa 'role'

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error_msg", "Username atau Email sudah terdaftar.");
      return res.redirect("/register");
    }

    // --- LOGIKA BARU: PENGGUNA PERTAMA ADALAH ADMIN ---
    const isFirstAccount = (await User.countDocuments()) === 0;
    const role = isFirstAccount ? "admin" : "user";
    // ----------------------------------------------------

    const newUser = new User({ username, email, password, role }); // 'role' ditentukan oleh logika di atas
    await newUser.save();

    req.flash("success_msg", "Registrasi berhasil! Silakan login.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Terjadi kesalahan, silakan coba lagi.");
    res.redirect("/register");
  }
};

// ... sisa fungsi (getLogin, postLogin, postLogout) tetap sama ...
exports.getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error_msg", "Username atau Password salah.");
      return res.redirect("/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error_msg", "Username atau Password salah.");
      return res.redirect("/login");
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.isLoggedIn = true;

    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Terjadi kesalahan, silakan coba lagi.");
    res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
