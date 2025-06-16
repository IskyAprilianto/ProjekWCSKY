const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware untuk membuat slug dari judul sebelum disimpan
articleSchema.pre("validate", function (next) {
  if (this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_]+/g, "-") +
      "-" +
      Date.now();
  }
  next();
});

// Membuat text index pada field 'title' dan 'content' untuk optimasi pencarian
articleSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Article", articleSchema);
