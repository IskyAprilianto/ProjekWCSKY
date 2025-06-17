const Article = require("../models/Article");
const Category = require("../models/Category");
const Comment = require("../models/Comment");

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
    const articlesBlock1 = allArticles.slice(0, 5);
    const articlesBlock2 = allArticles.slice(5, 10);
    const articlesBlock3 = allArticles.slice(10);
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

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).send("Artikel tidak ditemukan");

    const categories = await Category.find().sort({ name: 1 });

    const comments = await Comment.find({ article: article._id, parent: null })
      .sort({ createdAt: 1 })
      .populate("author", "username")
      .populate({
        path: "replies",
        options: { sort: { createdAt: 1 } },
        populate: {
          path: "author",
          select: "username",
        },
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
