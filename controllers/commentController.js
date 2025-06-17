const Comment = require("../models/Comment");
const Article = require("../models/Article");

/**
 * Memproses data dari form komentar baru atau balasan
 */
exports.postComment = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      req.flash("error_msg", "Artikel tidak ditemukan.");
      return res.redirect("/");
    }

    const { content, parentId } = req.body;

    let finalContent = content;
    let topLevelParentId = null;

    // Logika untuk @tag dan menentukan induk utama dari sebuah balasan
    if (parentId) {
      const parentComment = await Comment.findById(parentId).populate(
        "author",
        "username"
      );
      if (parentComment) {
        finalContent = `@${parentComment.author.username} ${content}`;
        topLevelParentId = parentComment.parent || parentComment._id;
      }
    }

    const newComment = new Comment({
      content: finalContent,
      article: article._id,
      author: req.session.userId,
      parent: parentId || null,
    });

    await newComment.save();

    // Jika ini adalah balasan, tambahkan ID balasan ini ke komentar induk paling atas
    if (topLevelParentId) {
      await Comment.findByIdAndUpdate(topLevelParentId, {
        $push: { replies: newComment._id },
      });
    }

    // Arahkan kembali ke artikel, scroll ke komentar yang baru dibuat
    res.redirect(`/artikel/${req.params.slug}#comment-${newComment._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal mengirim komentar.");
    res.redirect(`/artikel/${req.params.slug}`);
  }
};

/**
 * Menangani aksi like/unlike pada sebuah komentar
 */
exports.toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.session.userId;
    if (!comment) {
      req.flash("error_msg", "Komentar tidak ditemukan.");
      // Perlu redirect ke halaman sebelumnya, tapi kita tidak tahu pasti. Redirect ke home adalah pilihan aman.
      return res.redirect("/");
    }

    // Cek apakah user sudah ada di dalam array 'likes'
    const hasLikedIndex = comment.likes.indexOf(userId);

    if (hasLikedIndex > -1) {
      // Jika ada, hapus (unlike)
      comment.likes.splice(hasLikedIndex, 1);
    } else {
      // Jika tidak ada, tambahkan (like)
      comment.likes.push(userId);
    }
    await comment.save();

    const populatedComment = await comment.populate("article", "slug");
    // Arahkan kembali ke artikel, scroll ke komentar yang di-like
    res.redirect(
      `/artikel/${populatedComment.article.slug}#comment-${req.params.id}`
    );
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};
