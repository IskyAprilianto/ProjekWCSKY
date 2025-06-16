const Article = require("../models/Article");
const Category = require("../models/Category");
const Comment = require("../models/Comment");

/**
 * Menampilkan Halaman Utama (Homepage)
 * - Mengambil artikel dan membaginya menjadi 3 blok untuk tata letak unik.
 */
exports.getHomepage = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    let filter = {};
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        filter = { category: category.name };
      }
    }

    const allArticles = await Article.find(filter).sort({ createdAt: -1 });

    // Membagi artikel menjadi 3 blok sesuai permintaan tata letak
    const articlesBlock1 = allArticles.slice(0, 5); // Blok 1: 5 artikel pertama untuk grid
    const articlesBlock2 = allArticles.slice(5, 10); // Blok 2: 5 artikel berikutnya untuk daftar
    const articlesBlock3 = allArticles.slice(10); // Blok 3: Sisa artikel untuk grid lagi

    res.render("index", {
      title: "SKY.com - Berita Terkini",
      articlesBlock1,
      articlesBlock2,
      articlesBlock3,
      categories,
      currentCategory: req.query.category || "all",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan pada server");
  }
};

/**
 * Menampilkan Halaman Detail Artikel
 * - Mengambil satu artikel berdasarkan slug.
 * - Mengambil semua komentar & balasannya secara berjenjang.
 */
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).send("Artikel tidak ditemukan");
    }

    const categories = await Category.find().sort({ name: 1 });

    const comments = await Comment.find({ article: article._id, parent: null })
      .sort({ createdAt: 1 })
      .populate("author", "username")
      .populate({
        path: "replies",
        options: { sort: { createdAt: 1 } },
        populate: [
          { path: "author", select: "username" },
          {
            path: "replies",
            options: { sort: { createdAt: 1 } },
            populate: { path: "author", select: "username" },
          },
        ],
      });

    res.render("article-detail", {
      title: article.title,
      article,
      comments,
      categories,
      currentCategory: "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/**
 * Menangani Fungsi Pencarian
 * - Mencari artikel berdasarkan query menggunakan text index.
 */
exports.searchArticles = async (req, res) => {
  try {
    const query = req.query.q;
    const categories = await Category.find().sort({ name: 1 });

    let articles = [];
    if (query && query.trim() !== "") {
      articles = await Article.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    }

    res.render("search-results", {
      title: `Hasil Pencarian untuk "${query}"`,
      query,
      articles,
      categories,
      currentCategory: "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
