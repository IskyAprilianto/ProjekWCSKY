# SKYnews - Portal Berita Modern

Selamat datang di SKYnews, sebuah aplikasi web portal berita full-stack yang dibangun dengan Node.js, Express, dan MongoDB. Aplikasi ini dirancang untuk menjadi platform berita yang dinamis, interaktif, dan mudah dikelola.

![Tampilan Homepage SKYnews](image_3a3fa5.jpg)

## Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur modern yang terbagi menjadi dua bagian utama: halaman publik dan dashboard admin.

### Halaman Publik
* **Tampilan Berita Dinamis:** Homepage dengan tata letak unik yang menampilkan berita terbaru dan rekomendasi.
* **Filter Berdasarkan Kategori:** Pengguna dapat dengan mudah memfilter berita berdasarkan kategori yang tersedia.
* **Fungsi Pencarian:** Fitur pencarian canggih berbasis teks untuk menemukan artikel berdasarkan judul atau konten.
* **Halaman Detail Artikel:** Setiap artikel memiliki halaman detailnya sendiri.
* **Sistem Komentar Berjenjang:** Pengguna dapat berdiskusi di setiap artikel dengan sistem komentar dan balasan yang interaktif.
* **Fitur "Suka" & "Balas":** Pengguna yang sudah login dapat menyukai dan membalas komentar.
* **Desain Responsif:** Tampilan yang menyesuaikan diri dengan baik di berbagai ukuran layar, dari desktop hingga mobile.

### Dashboard Admin
* **Otentikasi Aman:** Sistem login khusus untuk admin.
* **Manajemen Artikel (CRUD):** Admin dapat membuat, membaca, memperbarui, dan menghapus artikel dengan mudah.
* **Manajemen Kategori (CRUD):** Admin dapat menambah dan menghapus kategori berita secara dinamis.
* **Moderasi Komentar:** Admin memiliki halaman khusus untuk melihat semua komentar dan menghapus yang tidak pantas.
* **Sidebar Responsif:** Dashboard admin dilengkapi dengan sidebar menu yang bisa disembunyikan (hamburger menu) pada tampilan mobile.

## Teknologi yang Digunakan

* **Backend:**
  * **Node.js:** Lingkungan eksekusi JavaScript di sisi server.
  * **Express.js:** Framework web untuk membangun aplikasi dan API.
  * **MongoDB:** Database NoSQL untuk menyimpan data artikel, user, kategori, dan komentar.
  * **Mongoose:** ODM (Object Data Modeling) untuk berinteraksi dengan MongoDB secara lebih mudah.
* **Frontend:**
  * **EJS (Embedded JavaScript):** Template engine untuk merender halaman HTML secara dinamis.
  * **CSS3:** Untuk styling dan layout, termasuk penggunaan Flexbox dan Grid.
  * **JavaScript (Client-Side):** Untuk fungsionalitas interaktif seperti tombol "Suka" tanpa refresh, menu hamburger, dan tombol "Scroll to Top".
* **Lain-lain:**
  * **Cloudinary:** Layanan cloud storage untuk menangani upload dan penyimpanan gambar.
  * **`connect-flash`:** Untuk menampilkan notifikasi/alert (misalnya, "login berhasil").
  * **`express-session`:** Untuk mengelola sesi login pengguna.
  * **`bcrypt`:** Untuk meng-enkripsi dan mengamankan password pengguna.
  * **`multer` & `multer-storage-cloudinary`:** Middleware untuk menangani file upload.
  * **`dotenv`:** Untuk mengelola variabel lingkungan (environment variables).

## Instalasi & Menjalankan Secara Lokal

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/nama-anda/nama-repo-anda.git](https://github.com/nama-anda/nama-repo-anda.git)
    cd nama-repo-anda
    ```

2.  **Install Dependensi**
    Pastikan Anda sudah memiliki Node.js terinstal. Jalankan perintah berikut di terminal:
    ```bash
    npm install
    ```

3.  **Buat File `.env`**
    Buat file bernama `.env` di direktori utama proyek. Salin isi dari `.env.example` (jika ada) atau isi dengan format berikut, lalu ganti dengan kredensial Anda sendiri:
    ```
    MONGO_URI=mongodb+srv://...
    SESSION_SECRET=kunci_rahasia_anda_yang_sangat_aman
    CLOUDINARY_CLOUD_NAME=nama_cloud_cloudinary_anda
    CLOUDINARY_API_KEY=api_key_cloudinary_anda
    CLOUDINARY_API_SECRET=api_secret_cloudinary_anda
    ```

4.  **Jalankan Server**
    Gunakan perintah di bawah ini untuk menjalankan server dengan `nodemon` (akan otomatis restart saat ada perubahan kode):
    ```bash
    npm run dev
    ```
    Atau dengan Node biasa:
    ```bash
    npm start
    ```
    Aplikasi akan berjalan di `http://localhost:3000`.

5.  **Membuat Akun Admin Pertama**
    * Buka `http://localhost:3000/register`.
    * Daftarkan akun pertama Anda. Akun pertama yang dibuat secara otomatis akan memiliki peran **'admin'**.
    * Semua akun yang didaftarkan setelahnya akan memiliki peran 'user'.

## Kontributor

* **Isky Dwi Aprilianto** - *Developer Utama*

Terima kasih telah mengunjungi proyek ini!
