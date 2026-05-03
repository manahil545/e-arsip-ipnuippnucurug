-- =============================================
-- Database: Aplikasi Arsip PR IPNU IPPNU DESA CURUG
-- Version: 1.0
-- =============================================

-- Hapus database jika sudah ada (hati-hati di production!)
DROP DATABASE IF EXISTS arsip_ipnu_ippnu;

-- Buat database baru
CREATE DATABASE arsip_ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE arsip_ipnu_ippnu;

-- =============================================
-- Tabel Users untuk Autentikasi
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active TINYINT(1) DEFAULT 1,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabel Surat Masuk
-- =============================================
CREATE TABLE surat_masuk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_surat VARCHAR(100) NOT NULL,
    tanggal_surat DATE NOT NULL,
    tanggal_diterima DATE NOT NULL,
    pengirim VARCHAR(200) NOT NULL,
    perihal TEXT NOT NULL,
    kategori ENUM('IPNU', 'IPPNU', 'Bersama') NOT NULL,
    indeks ENUM('A', 'B', 'C') NOT NULL,
    keterangan TEXT,
    file_path VARCHAR(255),
    file_name VARCHAR(255),
    file_size INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_nomor_surat (nomor_surat),
    INDEX idx_tanggal_surat (tanggal_surat),
    INDEX idx_kategori (kategori),
    INDEX idx_indeks (indeks),
    FULLTEXT idx_search (nomor_surat, pengirim, perihal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabel Surat Keluar
-- =============================================
CREATE TABLE surat_keluar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_surat VARCHAR(100) NOT NULL,
    tanggal_surat DATE NOT NULL,
    tujuan VARCHAR(200) NOT NULL,
    perihal TEXT NOT NULL,
    kategori ENUM('IPNU', 'IPPNU', 'Bersama') NOT NULL,
    indeks ENUM('A', 'B', 'C') NOT NULL,
    file_path VARCHAR(255),
    file_name VARCHAR(255),
    file_size INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_nomor_surat (nomor_surat),
    INDEX idx_tanggal_surat (tanggal_surat),
    INDEX idx_kategori (kategori),
    INDEX idx_indeks (indeks),
    FULLTEXT idx_search (nomor_surat, tujuan, perihal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabel Inventaris
-- =============================================
CREATE TABLE inventaris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(200) NOT NULL,
    kode_inventaris VARCHAR(50) UNIQUE NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    jumlah INT NOT NULL DEFAULT 1,
    kondisi ENUM('Baik', 'Rusak Ringan', 'Rusak Berat') DEFAULT 'Baik',
    lokasi_penyimpanan VARCHAR(200) NOT NULL,
    tanggal_perolehan DATE NOT NULL,
    harga_perolehan DECIMAL(15, 2),
    status_peminjaman ENUM('Tersedia', 'Dipinjam') DEFAULT 'Tersedia',
    peminjam VARCHAR(200),
    tanggal_peminjaman DATE,
    tanggal_kembali DATE,
    keterangan TEXT,
    foto_path VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_kode_inventaris (kode_inventaris),
    INDEX idx_kategori (kategori),
    INDEX idx_kondisi (kondisi),
    INDEX idx_status (status_peminjaman),
    FULLTEXT idx_search (nama_barang, kode_inventaris, kategori)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabel Activity Log (untuk tracking aktivitas)
-- =============================================
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Insert Data Default
-- =============================================

-- Insert default users
-- Password untuk admin: admin123
-- Password untuk user: user123
INSERT INTO users (username, password, nama_lengkap, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@ipnu-ippnu.com', 'admin'),
('user', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'User Biasa', 'user@ipnu-ippnu.com', 'user');

-- Insert sample data surat masuk (opsional untuk testing)
INSERT INTO surat_masuk (nomor_surat, tanggal_surat, tanggal_diterima, pengirim, perihal, kategori, indeks, keterangan, created_by) VALUES 
('001/SM/IPNU/I/2024', '2024-01-15', '2024-01-16', 'PC IPNU Kabupaten', 'Undangan Rapat Koordinasi', 'IPNU', 'A', 'Rapat koordinasi tingkat kabupaten', 1),
('002/SM/IPPNU/I/2024', '2024-01-20', '2024-01-21', 'PC IPPNU Kabupaten', 'Surat Edaran Program Kerja', 'IPPNU', 'A', 'Program kerja tahun 2024', 1);

-- Insert sample data surat keluar (opsional untuk testing)
INSERT INTO surat_keluar (nomor_surat, tanggal_surat, tujuan, perihal, kategori, indeks, created_by) VALUES 
('001/SK/IPNU/I/2024', '2024-01-25', 'PC IPNU Kabupaten', 'Laporan Kegiatan Bulanan', 'IPNU', 'B', 1),
('002/SK/IPPNU/I/2024', '2024-01-28', 'PC IPPNU Kabupaten', 'Permohonan Dana Kegiatan', 'IPPNU', 'A', 1);

-- Insert sample data inventaris (opsional untuk testing)
INSERT INTO inventaris (nama_barang, kode_inventaris, kategori, jumlah, kondisi, lokasi_penyimpanan, tanggal_perolehan, status_peminjaman, created_by) VALUES 
('Laptop ASUS', 'INV-ELK-001', 'Elektronik', 1, 'Baik', 'Kantor Sekretariat', '2023-06-15', 'Tersedia', 1),
('Meja Kantor', 'INV-FUR-001', 'Furniture', 5, 'Baik', 'Kantor Sekretariat', '2023-05-10', 'Tersedia', 1),
('Proyektor', 'INV-ELK-002', 'Elektronik', 1, 'Baik', 'Gudang', '2023-08-20', 'Dipinjam', 1);

-- Update proyektor yang dipinjam
UPDATE inventaris SET peminjam = 'Ahmad Zulfikar', tanggal_peminjaman = '2024-02-01' WHERE kode_inventaris = 'INV-ELK-002';

-- =============================================
-- Views untuk Reporting (Opsional)
-- =============================================

-- View untuk statistik surat masuk per kategori
CREATE VIEW v_statistik_surat_masuk AS
SELECT 
    kategori,
    COUNT(*) as total,
    COUNT(CASE WHEN indeks = 'A' THEN 1 END) as indeks_a,
    COUNT(CASE WHEN indeks = 'B' THEN 1 END) as indeks_b,
    COUNT(CASE WHEN indeks = 'C' THEN 1 END) as indeks_c,
    YEAR(tanggal_surat) as tahun,
    MONTH(tanggal_surat) as bulan
FROM surat_masuk
GROUP BY kategori, YEAR(tanggal_surat), MONTH(tanggal_surat);

-- View untuk statistik inventaris
CREATE VIEW v_statistik_inventaris AS
SELECT 
    kategori,
    COUNT(*) as total_item,
    SUM(jumlah) as total_quantity,
    COUNT(CASE WHEN status_peminjaman = 'Tersedia' THEN 1 END) as tersedia,
    COUNT(CASE WHEN status_peminjaman = 'Dipinjam' THEN 1 END) as dipinjam,
    COUNT(CASE WHEN kondisi = 'Baik' THEN 1 END) as kondisi_baik,
    COUNT(CASE WHEN kondisi = 'Rusak Ringan' THEN 1 END) as rusak_ringan,
    COUNT(CASE WHEN kondisi = 'Rusak Berat' THEN 1 END) as rusak_berat
FROM inventaris
GROUP BY kategori;

-- =============================================
-- Stored Procedures (Opsional untuk fitur lanjutan)
-- =============================================

DELIMITER //

-- Procedure untuk mencatat log aktivitas
CREATE PROCEDURE log_activity(
    IN p_user_id INT,
    IN p_action VARCHAR(50),
    IN p_table_name VARCHAR(50),
    IN p_record_id INT,
    IN p_description TEXT,
    IN p_ip_address VARCHAR(45),
    IN p_user_agent VARCHAR(255)
)
BEGIN
    INSERT INTO activity_log (user_id, action, table_name, record_id, description, ip_address, user_agent)
    VALUES (p_user_id, p_action, p_table_name, p_record_id, p_description, p_ip_address, p_user_agent);
END//

-- Procedure untuk generate kode inventaris otomatis
CREATE PROCEDURE generate_kode_inventaris(
    IN p_kategori VARCHAR(100),
    OUT p_kode VARCHAR(50)
)
BEGIN
    DECLARE kategori_code VARCHAR(10);
    DECLARE next_number INT;
    
    -- Generate kategori code (3 huruf pertama uppercase)
    SET kategori_code = UPPER(LEFT(REPLACE(p_kategori, ' ', ''), 3));
    
    -- Get next number
    SELECT COALESCE(MAX(CAST(SUBSTRING(kode_inventaris, -3) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM inventaris
    WHERE kode_inventaris LIKE CONCAT('INV-', kategori_code, '-%');
    
    -- Generate kode
    SET p_kode = CONCAT('INV-', kategori_code, '-', LPAD(next_number, 3, '0'));
END//

DELIMITER ;

-- =============================================
-- Triggers untuk Audit Trail
-- =============================================

DELIMITER //

-- Trigger untuk surat_masuk setelah insert
CREATE TRIGGER after_surat_masuk_insert
AFTER INSERT ON surat_masuk
FOR EACH ROW
BEGIN
    INSERT INTO activity_log (user_id, action, table_name, record_id, description)
    VALUES (NEW.created_by, 'INSERT', 'surat_masuk', NEW.id, CONCAT('Menambah surat masuk: ', NEW.nomor_surat));
END//

-- Trigger untuk surat_keluar setelah insert
CREATE TRIGGER after_surat_keluar_insert
AFTER INSERT ON surat_keluar
FOR EACH ROW
BEGIN
    INSERT INTO activity_log (user_id, action, table_name, record_id, description)
    VALUES (NEW.created_by, 'INSERT', 'surat_keluar', NEW.id, CONCAT('Menambah surat keluar: ', NEW.nomor_surat));
END//

-- Trigger untuk inventaris setelah insert
CREATE TRIGGER after_inventaris_insert
AFTER INSERT ON inventaris
FOR EACH ROW
BEGIN
    INSERT INTO activity_log (user_id, action, table_name, record_id, description)
    VALUES (NEW.created_by, 'INSERT', 'inventaris', NEW.id, CONCAT('Menambah inventaris: ', NEW.nama_barang));
END//

DELIMITER ;

-- =============================================
-- Grants & Privileges (opsional, sesuaikan dengan kebutuhan)
-- =============================================
-- GRANT ALL PRIVILEGES ON arsip_ipnu_ippnu.* TO 'arsip_user'@'localhost' IDENTIFIED BY 'password_kuat_123';
-- FLUSH PRIVILEGES;

-- =============================================
-- Database Setup Complete
-- =============================================
SELECT 'Database arsip_ipnu_ippnu berhasil dibuat!' AS status;
