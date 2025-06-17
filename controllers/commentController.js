const Comment = require("../models/Comment");
const Article = require("../models/Article");

exports.postComment = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      req.flash("error_msg", "Artikel tidak ditemukan.");
      return res.redirect("/");
    }

    const { content, parentId } = req.body;

    // Logika untuk menambahkan tag @username sudah dihapus.
    // Sekarang kita langsung menggunakan 'content' dari form.
    const newComment = new Comment({
      content: content,
      article: article._id,
      author: req.session.userId,
      parent: parentId || null,
    });

    await newComment.save();

    if (parentId) {
      // Logika untuk mengelompokkan balasan di bawah induk utama tetap ada
      const parentComment = await Comment.findById(parentId);
      const topLevelParentId = parentComment.parent || parentComment._id;
      await Comment.findByIdAndUpdate(topLevelParentId, {
        $push: { replies: newComment._id },
      });
    }

    res.redirect(`/artikel/${req.params.slug}#comment-${newComment._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal mengirim komentar.");
    res.redirect(`/artikel/${req.params.slug}`);
  }
};

exports.toggleLikeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.session.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      req.flash("error_msg", "Komentar tidak ditemukan.");
      return res.redirect("back");
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
    } else {
      await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId },
      });
    }

    res.redirect("back");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal melakukan aksi.");
    res.redirect("back");
  }
};
