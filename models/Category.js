const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Slug digunakan untuk URL yang lebih ramah (contoh: /?category=berita-nasional)
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

// Middleware untuk membuat slug secara otomatis dari nama sebelum disimpan
categorySchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[\s_]+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
