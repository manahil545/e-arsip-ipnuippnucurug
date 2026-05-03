# 📚 Dokumentasi Instalasi & Setup

## Aplikasi Arsip PR IPNU IPPNU Desa Curug

Aplikasi web mobile untuk mengelola arsip surat masuk, surat keluar, dan inventaris dengan PHP & MySQL.

---

## 🎯 Requirements

### Minimum Requirements
- **PHP:** 7.4 atau lebih tinggi
- **MySQL/MariaDB:** 5.7 atau lebih tinggi
- **Web Server:** Apache/Nginx atau PHP Built-in Server
- **PHP Extensions:**
  - mysqli
  - mbstring
  - fileinfo
  - session

### Recommended
- **PHP:** 8.0+
- **MySQL:** 8.0+
- **RAM:** 512MB minimum
- **Storage:** 100MB minimum

---

## 📦 Cara Instalasi

### Opsi 1: Instalasi Otomatis (Recommended)

#### Windows (XAMPP/WAMP)
```bash
# 1. Extract aplikasi ke C:\xampp\htdocs\arsip-ipnu
# 2. Buka Command Prompt di folder aplikasi
# 3. Jalankan installer
install.bat
```

#### Linux/Mac
```bash
# 1. Extract aplikasi
# 2. Buka terminal di folder aplikasi
# 3. Berikan permission
chmod +x install.sh

# 4. Jalankan installer
./install.sh
```

### Opsi 2: Setup Wizard (Web-based)
1. Upload semua file ke web server
2. Buka browser dan akses: `http://localhost/nama-folder/setup.php`
3. Ikuti wizard step by step

### Opsi 3: Manual Installation

#### 1. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE arsip_ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import database
mysql -u root -p arsip_ipnu_ippnu < database.sql

# Atau via phpMyAdmin:
# - Buat database 'arsip_ipnu_ippnu'
# - Import file database.sql
```

#### 2. Konfigurasi Database
Edit file `config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');          // Sesuaikan
define('DB_PASS', '');              // Sesuaikan
define('DB_NAME', 'arsip_ipnu_ippnu');
```

#### 3. Setup Folder Uploads
```bash
# Linux/Mac
mkdir uploads
chmod 777 uploads

# Windows (via Command Prompt)
mkdir uploads
```

#### 4. Test Koneksi
Buka browser dan akses: `http://localhost/nama-folder/test_connection.php`

---

## 🚀 Menjalankan Aplikasi

### XAMPP (Windows)
1. Buka XAMPP Control Panel
2. Start Apache dan MySQL
3. Pindahkan folder aplikasi ke `C:\xampp\htdocs\`
4. Akses: `http://localhost/nama-folder/login.php`

### WAMP (Windows)
1. Buka WAMP
2. Start All Services
3. Pindahkan folder aplikasi ke `C:\wamp64\www\`
4. Akses: `http://localhost/nama-folder/login.php`

### LAMP (Linux)
1. Pindahkan folder ke `/var/www/html/`
2. Set permission: `sudo chmod -R 755 /var/www/html/nama-folder`
3. Restart Apache: `sudo service apache2 restart`
4. Akses: `http://localhost/nama-folder/login.php`

### PHP Built-in Server (Testing Only)
```bash
# Buka terminal/cmd di folder aplikasi
php -S localhost:8000

# Akses di browser
http://localhost:8000/login.php
```

---

## 🔑 Login Default

### Administrator
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin (full access)

### User Biasa
- **Username:** `user`
- **Password:** `user123`
- **Role:** User (limited access)

> ⚠️ **PENTING:** Segera ubah password default setelah login pertama kali!

---

## 📁 Struktur File

```
arsip-ipnu-ippnu/
├── config.php              # Konfigurasi database & helper
├── database.sql            # SQL schema & data awal
├── login.php              # Halaman login
├── logout.php             # Handler logout
├── dashboard.php          # Dashboard utama
├── surat_masuk.php        # Modul surat masuk
├── surat_keluar.php       # Modul surat keluar
├── inventaris.php         # Modul inventaris
├── test_connection.php    # Test koneksi database
├── setup.php              # Setup wizard
├── install.sh             # Installer Linux/Mac
├── install.bat            # Installer Windows
├── .htaccess              # Apache config
├── uploads/               # Folder untuk upload file
└── README.md             # Dokumentasi
```

---

## ⚙️ Konfigurasi Lanjutan

### Upload File Settings
Edit di `config.php`:
```php
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']);
```

### Session Timeout
Edit di `config.php`:
```php
$inactive_timeout = 3600; // 1 jam (dalam detik)
```

### PHP Settings
Edit di `php.ini` atau `.htaccess`:
```ini
upload_max_filesize = 5M
post_max_size = 5M
max_execution_time = 300
memory_limit = 128M
```

---

## 🔧 Troubleshooting

### Error: Connection Failed
**Solusi:**
1. Cek MySQL service berjalan
2. Cek kredensial di `config.php`
3. Cek nama database sudah benar
4. Jalankan: `test_connection.php`

### Error: Upload Failed
**Solusi:**
```bash
# Linux/Mac
chmod 777 uploads/

# Windows - Cek folder uploads ada dan tidak read-only
```

### Error: Session Error
**Solusi:**
```bash
# Linux
sudo chmod 777 /tmp

# Windows - Cek php.ini
session.save_path = "C:/xampp/tmp"
```

### Error: Cannot Access Database
**Solusi:**
```sql
-- Cek user privileges
GRANT ALL PRIVILEGES ON arsip_ipnu_ippnu.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: Headers Already Sent
**Solusi:**
- Pastikan tidak ada output sebelum `header()`
- Cek BOM di file PHP (hapus BOM)
- Cek tidak ada spasi/newline sebelum `<?php`

---

## 🔒 Security Best Practices

### 1. Ganti Password Default
```sql
-- Via MySQL
UPDATE users SET password = '$2y$10$...' WHERE username = 'admin';
```

### 2. Protect Config File
Tambahkan di `.htaccess`:
```apache
<Files "config.php">
    Order allow,deny
    Deny from all
</Files>
```

### 3. Disable Directory Listing
Tambahkan di `.htaccess`:
```apache
Options -Indexes
```

### 4. Enable HTTPS
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 5. Backup Database Regular
```bash
# Manual backup
mysqldump -u root -p arsip_ipnu_ippnu > backup_$(date +%Y%m%d).sql

# Auto backup (cron job)
0 2 * * * mysqldump -u root -pPASSWORD arsip_ipnu_ippnu > /backup/arsip_$(date +\%Y\%m\%d).sql
```

---

## 📊 Database Schema

### Tabel: users
- id, username, password, nama_lengkap, email, role, is_active, last_login

### Tabel: surat_masuk
- id, nomor_surat, tanggal_surat, tanggal_diterima, pengirim, perihal, kategori, indeks, keterangan, file_path

### Tabel: surat_keluar
- id, nomor_surat, tanggal_surat, tujuan, perihal, kategori, indeks, file_path

### Tabel: inventaris
- id, nama_barang, kode_inventaris, kategori, jumlah, kondisi, lokasi_penyimpanan, status_peminjaman, peminjam

### Tabel: activity_log
- id, user_id, action, table_name, record_id, description, ip_address

---

## 🆘 Support

### Dokumentasi Lengkap
- Baca file `README.md` untuk fitur lengkap
- Akses `test_connection.php` untuk troubleshooting

### Common Issues
1. **Koneksi Database Gagal:** Cek credentials di `config.php`
2. **Upload Tidak Berfungsi:** Set permission folder `uploads/` menjadi 777
3. **Login Gagal:** Pastikan database sudah diimport dengan benar

### Contact
Untuk bantuan lebih lanjut, hubungi administrator PR IPNU IPPNU Desa Curug.

---

## 📝 Update Log

### Version 1.0.0
- ✅ Initial release
- ✅ Login system dengan session
- ✅ Dashboard dengan statistik
- ✅ CRUD Surat Masuk & Keluar
- ✅ CRUD Inventaris
- ✅ File upload system
- ✅ Search & filter
- ✅ Activity logging
- ✅ Mobile responsive design

---

## 📄 License

© 2024 PR IPNU IPPNU Desa Curug. All rights reserved.

---

## 🚀 Quick Start

```bash
# 1. Clone/Download aplikasi
# 2. Install database
mysql -u root -p < database.sql

# 3. Update config.php
# 4. Buat folder uploads
mkdir uploads && chmod 777 uploads

# 5. Jalankan server
php -S localhost:8000

# 6. Akses browser
http://localhost:8000/login.php

# 7. Login dengan:
# admin / admin123
```

**Selamat menggunakan! 🎉**
