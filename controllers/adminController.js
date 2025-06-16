const Article = require("../models/Article");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const fs = require("fs");
const path = require("path");

// --- Fungsi Terkait Artikel ---

exports.getDashboard = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      articles,
    });
  } catch (err) {
    console.error(err);
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
  }
};

exports.postAddArticle = (req, res) => {
  const { title, content, category } = req.body;
  if (!req.file) {
    req.flash("error_msg", "Gambar sampul wajib di-upload.");
    return res.redirect("/admin/articles/new");
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  const newArticle = new Article({ title, content, category, imageUrl });

  newArticle
    .save()
    .then(() => {
      req.flash("success_msg", "Artikel baru berhasil ditambahkan!");
      res.redirect("/admin/dashboard");
    })
    .catch((err) => {
      console.error(err);
      req.flash("error_msg", "Gagal menambahkan artikel.");
      res.redirect("/admin/articles/new");
    });
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
    res.redirect("/admin/dashboard");
  }
};

exports.postEditArticle = async (req, res) => {
  try {
    const { title, content, category, oldImageUrl } = req.body;
    let imageUrl = oldImageUrl;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      fs.unlink(path.join(__dirname, "..", oldImageUrl), (err) => {
        if (err) console.error("Gagal hapus gambar lama:", err);
      });
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
    const article = await Article.findByIdAndDelete(req.params.id);
    if (article && article.imageUrl) {
      fs.unlink(path.join(__dirname, "..", article.imageUrl), (err) => {
        if (err) console.error("Gagal hapus file gambar:", err);
      });
    }
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
