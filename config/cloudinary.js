const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Konfigurasi Cloudinary dengan kredensial dari file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi penyimpanan untuk multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portal-berita-sky", // Nama folder di dalam Cloudinary
    allowed_formats: ["jpeg", "png", "jpg"], // Format file yang diizinkan
  },
});

module.exports = {
  cloudinary,
  storage,
};
