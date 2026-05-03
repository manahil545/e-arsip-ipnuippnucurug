<?php
/**
 * Konfigurasi Database dan Helper Functions
 * Aplikasi Arsip PR IPNU IPPNU Desa Curug
 */

// =============================================
// KONFIGURASI DATABASE
// =============================================
define('DB_HOST', 'localhost');        // Host database
define('DB_USER', 'root');             // Username database (sesuaikan dengan setup Anda)
define('DB_PASS', '');                 // Password database (sesuaikan dengan setup Anda)
define('DB_NAME', 'arsip_ipnu_ippnu'); // Nama database
define('DB_CHARSET', 'utf8mb4');       // Character set

// =============================================
// KONFIGURASI APLIKASI
// =============================================
define('APP_NAME', 'Arsip PR IPNU IPPNU');
define('APP_VERSION', '1.0.0');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']);

// =============================================
// KONEKSI DATABASE MENGGUNAKAN MySQLi
// =============================================
$conn = null;

try {
    // Membuat koneksi database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Cek koneksi
    if ($conn->connect_error) {
        throw new Exception("Koneksi database gagal: " . $conn->connect_error);
    }
    
    // Set charset
    if (!$conn->set_charset(DB_CHARSET)) {
        throw new Exception("Error setting charset: " . $conn->error);
    }
    
    // Set timezone (opsional)
    $conn->query("SET time_zone = '+07:00'");
    
} catch (Exception $e) {
    // Log error (dalam production, simpan ke file log)
    error_log($e->getMessage());
    
    // Tampilkan pesan error user-friendly
    die("
        <html>
        <head>
            <title>Database Error</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 40px; }
                .error-box { 
                    background: white; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h2 { color: #dc2626; }
                .error-message { background: #fee2e2; padding: 15px; border-radius: 5px; color: #991b1b; }
                .help { margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 5px; }
                a { color: #059669; text-decoration: none; font-weight: bold; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class='error-box'>
                <h2>❌ Error Koneksi Database</h2>
                <div class='error-message'>
                    <p><strong>Tidak dapat terhubung ke database!</strong></p>
                    <p>Aplikasi tidak dapat terhubung ke database MySQL.</p>
                </div>
                <div class='help'>
                    <h3>🔧 Cara Memperbaiki:</h3>
                    <ol>
                        <li>Pastikan MySQL/MariaDB sudah berjalan</li>
                        <li>Cek kredensial database di file <code>config.php</code></li>
                        <li>Pastikan database sudah dibuat dengan menjalankan <code>database.sql</code></li>
                        <li>Gunakan <a href='test_connection.php'>Test Connection</a> untuk mengecek koneksi</li>
                    </ol>
                </div>
            </div>
        </body>
        </html>
    ");
}

// =============================================
// SESSION MANAGEMENT
// =============================================
if (session_status() === PHP_SESSION_NONE) {
    session_start();
    
    // Regenerate session ID untuk keamanan (setiap 30 menit)
    if (!isset($_SESSION['last_regenerate'])) {
        $_SESSION['last_regenerate'] = time();
    } elseif (time() - $_SESSION['last_regenerate'] > 1800) {
        session_regenerate_id(true);
        $_SESSION['last_regenerate'] = time();
    }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Cek apakah user sudah login
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['username']);
}

/**
 * Redirect jika belum login
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit();
    }
}

/**
 * Cek apakah user adalah admin
 */
function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * Sanitasi input untuk mencegah XSS
 */
function sanitizeInput($data) {
    global $conn;
    
    if ($data === null) {
        return null;
    }
    
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    if ($conn) {
        $data = $conn->real_escape_string($data);
    }
    
    return $data;
}

/**
 * Upload file dengan validasi
 */
function uploadFile($file, $allowed_types = null) {
    // Gunakan allowed types default jika tidak ditentukan
    if ($allowed_types === null) {
        $allowed_types = ALLOWED_FILE_TYPES;
    }
    
    // Buat folder uploads jika belum ada
    if (!file_exists(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0777, true);
    }
    
    $file_name = $file['name'];
    $file_tmp = $file['tmp_name'];
    $file_size = $file['size'];
    $file_error = $file['error'];
    
    // Check for errors
    if ($file_error !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'File terlalu besar (melebihi upload_max_filesize)',
            UPLOAD_ERR_FORM_SIZE => 'File terlalu besar (melebihi MAX_FILE_SIZE)',
            UPLOAD_ERR_PARTIAL => 'File hanya terupload sebagian',
            UPLOAD_ERR_NO_FILE => 'Tidak ada file yang diupload',
            UPLOAD_ERR_NO_TMP_DIR => 'Folder temporary tidak ditemukan',
            UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk',
            UPLOAD_ERR_EXTENSION => 'Upload dihentikan oleh extension',
        ];
        
        $message = $error_messages[$file_error] ?? 'Error uploading file';
        return ['success' => false, 'message' => $message];
    }
    
    // Check file size
    if ($file_size > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'File terlalu besar (max ' . (MAX_FILE_SIZE / 1024 / 1024) . 'MB)'];
    }
    
    // Get file extension
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // Check allowed types
    if (!in_array($file_ext, $allowed_types)) {
        return ['success' => false, 'message' => 'Tipe file tidak diizinkan. Gunakan: ' . implode(', ', $allowed_types)];
    }
    
    // Validate MIME type untuk keamanan ekstra
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file_tmp);
    finfo_close($finfo);
    
    $allowed_mimes = [
        'image/jpeg', 'image/jpg', 'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!in_array($mime_type, $allowed_mimes)) {
        return ['success' => false, 'message' => 'Tipe MIME file tidak valid'];
    }
    
    // Generate unique filename
    $new_file_name = uniqid('file_', true) . '.' . $file_ext;
    $file_path = UPLOAD_DIR . $new_file_name;
    
    // Move uploaded file
    if (move_uploaded_file($file_tmp, $file_path)) {
        return [
            'success' => true,
            'path' => 'uploads/' . $new_file_name,
            'name' => $file_name,
            'size' => $file_size
        ];
    } else {
        return ['success' => false, 'message' => 'Gagal memindahkan file'];
    }
}

/**
 * Hapus file dari server
 */
function deleteFile($file_path) {
    if ($file_path && file_exists($file_path)) {
        return unlink($file_path);
    }
    return false;
}

/**
 * Format tanggal ke format Indonesia
 */
function formatTanggalIndo($date) {
    if (!$date) return '-';
    
    $bulan = [
        1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    $pecahkan = explode('-', $date);
    
    if (count($pecahkan) == 3) {
        return $pecahkan[2] . ' ' . $bulan[(int)$pecahkan[1]] . ' ' . $pecahkan[0];
    }
    
    return $date;
}

/**
 * Format ukuran file
 */
function formatFileSize($bytes) {
    if ($bytes >= 1073741824) {
        return number_format($bytes / 1073741824, 2) . ' GB';
    } elseif ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    } else {
        return $bytes . ' bytes';
    }
}

/**
 * Log aktivitas user
 */
function logActivity($action, $table_name, $record_id = null, $description = null) {
    global $conn;
    
    if (!isLoggedIn()) return;
    
    $user_id = $_SESSION['user_id'];
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    $sql = "INSERT INTO activity_log (user_id, action, table_name, record_id, description, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issssss", $user_id, $action, $table_name, $record_id, $description, $ip_address, $user_agent);
    $stmt->execute();
    $stmt->close();
}

/**
 * Generate flash message
 */
function setFlashMessage($type, $message) {
    $_SESSION['flash_message'] = [
        'type' => $type,
        'message' => $message
    ];
}

/**
 * Get dan hapus flash message
 */
function getFlashMessage() {
    if (isset($_SESSION['flash_message'])) {
        $flash = $_SESSION['flash_message'];
        unset($_SESSION['flash_message']);
        return $flash;
    }
    return null;
}

/**
 * Escape output untuk keamanan
 */
function e($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

/**
 * Redirect dengan pesan
 */
function redirect($url, $message = null, $type = 'success') {
    if ($message) {
        setFlashMessage($type, $message);
    }
    header("Location: $url");
    exit();
}

/**
 * Generate CSRF Token
 */
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF Token
 */
function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Get user info
 */
function getCurrentUser() {
    if (!isLoggedIn()) return null;
    
    return [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'nama_lengkap' => $_SESSION['nama_lengkap'],
        'role' => $_SESSION['role']
    ];
}

// =============================================
// ERROR HANDLING
// =============================================

// Set error reporting (ubah di production)
if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Custom error handler
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    $error_message = "Error [$errno]: $errstr in $errfile on line $errline";
    error_log($error_message);
    
    // Tampilkan error user-friendly
    if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
        echo "<pre>$error_message</pre>";
    }
}

set_error_handler("customErrorHandler");

// =============================================
// TIMEZONE
// =============================================
date_default_timezone_set('Asia/Jakarta');

// =============================================
// AUTO LOGOUT (opsional)
// =============================================
$inactive_timeout = 3600; // 1 jam

if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $inactive_timeout)) {
    session_unset();
    session_destroy();
    header("Location: login.php?timeout=1");
    exit();
}

$_SESSION['last_activity'] = time();
?>
