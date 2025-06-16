const Comment = require("../models/Comment");
const Article = require("../models/Article");

exports.postComment = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article)
      return res.status(404).json({ message: "Artikel tidak ditemukan" });

    const { content, parentId } = req.body;

    const newComment = new Comment({
      content: content,
      article: article._id,
      author: req.session.userId,
      parent: parentId || null,
    });

    await newComment.save();

    // Jika ini adalah balasan, update komentar induk
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: newComment._id },
      });
    }

    // Kirim kembali data komentar baru sebagai JSON, populate penulisnya
    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username"
    );
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.session.userId;

    if (!comment) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    const hasLikedIndex = comment.likes.indexOf(userId);

    if (hasLikedIndex > -1) {
      // Jika sudah, hapus (unlike)
      comment.likes.splice(hasLikedIndex, 1);
    } else {
      // Jika belum, tambahkan (like)
      comment.likes.push(userId);
    }

    await comment.save();

    // Kirim kembali jumlah suka yang baru dan status disukai
    res.json({
      likesCount: comment.likes.length,
      isLiked: hasLikedIndex === -1, // true jika baru saja di-like
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
