const Article = require("../models/Article");
const Category = require("../models/Category");
const Comment = require("../models/Comment");

// --- Fungsi Terkait Artikel ---

exports.getDashboard = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.render("admin/dashboard", {
      title: "Daftar Artikel",
      articles,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal memuat daftar artikel.");
    res.redirect("/admin/dashboard");
  }
};

exports.getAddArticlePage = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render("admin/add-article", {
      title: "Tambah Artikel Baru",
      categories,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal memuat halaman.");
    res.redirect("/admin/dashboard");
  }
};

exports.postAddArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!req.file) {
      req.flash("error_msg", "Gambar sampul wajib di-upload.");
      return res.redirect("/admin/articles/new");
    }
    const imageUrl = req.file.path; // URL dari Cloudinary
    const newArticle = new Article({ title, content, category, imageUrl });
    await newArticle.save();

    req.flash("success_msg", "Artikel baru berhasil ditambahkan!");
    res.redirect("/admin/dashboard");
  } catch (err) {
    let errorMessage = "Gagal menambahkan artikel.";
    if (err.code === 11000) {
      errorMessage =
        "Judul atau slug artikel sudah ada, silakan gunakan judul lain.";
    }
    console.error(err);
    req.flash("error_msg", errorMessage);
    res.redirect("/admin/articles/new");
  }
};

exports.getEditArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const categories = await Category.find().sort({ name: 1 });
    if (!article) {
      req.flash("error_msg", "Artikel tidak ditemukan.");
      return res.redirect("/admin/dashboard");
    }
    res.render("admin/edit", {
      title: "Edit Artikel",
      article,
      categories,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal memuat halaman edit.");
    res.redirect("/admin/dashboard");
  }
};

exports.postEditArticle = async (req, res) => {
  try {
    const { title, content, category, oldImageUrl } = req.body;
    let imageUrl = oldImageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    }
    await Article.findByIdAndUpdate(req.params.id, {
      title,
      content,
      category,
      imageUrl,
    });

    req.flash("success_msg", "Artikel berhasil diperbarui!");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal memperbarui artikel.");
    res.redirect("/admin/dashboard");
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);

    req.flash("success_msg", "Artikel berhasil dihapus.");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal menghapus artikel.");
    res.redirect("/admin/dashboard");
  }
};

// --- Fungsi Terkait Kategori ---

exports.getManageCategoriesPage = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render("admin/manage-categories", {
      title: "Kelola Kategori",
      categories,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.postAddCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    req.flash("success_msg", "Kategori baru berhasil ditambahkan!");
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    req.flash(
      "error_msg",
      "Gagal menambahkan kategori, mungkin nama sudah ada."
    );
    res.redirect("/admin/categories");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Kategori berhasil dihapus.");
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal menghapus kategori.");
    res.redirect("/admin/categories");
  }
};

// --- Fungsi Terkait Komentar ---

exports.getManageCommentsPage = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .populate("article", "title slug");

    res.render("admin/manage-comments", {
      title: "Kelola Komentar",
      comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Komentar berhasil dihapus.");
    res.redirect("/admin/comments");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal menghapus komentar.");
    res.redirect("/admin/comments");
  }
};
