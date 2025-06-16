const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username tidak boleh kosong"],
      unique: true,
      lowercase: true,
    },
    email: {
      // <-- FIELD EMAIL DITAMBAHKAN DI SINI
      type: String,
      required: [true, "Email tidak boleh kosong"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password tidak boleh kosong"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Middleware untuk hash password sebelum disimpan
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
