<?php
/**
 * Test Koneksi Database
 * File ini untuk mengecek koneksi ke database MySQL
 */
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Koneksi Database - Arsip PR IPNU IPPNU</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            background: white;
            max-width: 800px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .test-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .test-section h3 {
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .status.success {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status.error {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .status.warning {
            background: #fef3c7;
            color: #92400e;
        }
        
        .icon {
            font-size: 20px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        
        .info-item label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
        }
        
        .info-item .value {
            font-size: 16px;
            color: #1f2937;
            margin-top: 5px;
            font-weight: 500;
        }
        
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
        }
        
        .error-detail {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            color: #991b1b;
        }
        
        .success-detail {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            color: #065f46;
        }
        
        code {
            background: #1f2937;
            color: #10b981;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        
        .requirements {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }
        
        .requirements h4 {
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .requirements ul {
            margin-left: 20px;
            color: #1e3a8a;
        }
        
        .requirements li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔌 Test Koneksi Database</h1>
            <p>Aplikasi Arsip PR IPNU IPPNU Desa Curug</p>
        </div>
        
        <div class="content">
            <?php
            // Konfigurasi database (ambil dari config.php jika ada)
            $db_host = 'localhost';
            $db_user = 'root';
            $db_pass = '';
            $db_name = 'arsip_ipnu_ippnu';
            
            // Array untuk menyimpan hasil test
            $tests = [];
            
            // ============================================
            // TEST 1: Cek Extension MySQLi
            // ============================================
            $tests['mysqli_extension'] = [
                'name' => 'PHP MySQLi Extension',
                'status' => extension_loaded('mysqli'),
                'message' => extension_loaded('mysqli') 
                    ? 'Extension MySQLi tersedia' 
                    : 'Extension MySQLi tidak tersedia. Aktifkan di php.ini'
            ];
            
            // ============================================
            // TEST 2: Cek koneksi ke MySQL Server
            // ============================================
            $mysqli_connect = false;
            $server_info = '';
            $conn = null;
            
            if (extension_loaded('mysqli')) {
                try {
                    $conn = @new mysqli($db_host, $db_user, $db_pass);
                    
                    if ($conn->connect_error) {
                        $tests['mysql_server'] = [
                            'name' => 'Koneksi ke MySQL Server',
                            'status' => false,
                            'message' => 'Gagal terhubung: ' . $conn->connect_error
                        ];
                    } else {
                        $mysqli_connect = true;
                        $server_info = $conn->server_info;
                        
                        $tests['mysql_server'] = [
                            'name' => 'Koneksi ke MySQL Server',
                            'status' => true,
                            'message' => 'Berhasil terhubung ke MySQL Server',
                            'info' => [
                                'Host' => $db_host,
                                'MySQL Version' => $server_info
                            ]
                        ];
                    }
                } catch (Exception $e) {
                    $tests['mysql_server'] = [
                        'name' => 'Koneksi ke MySQL Server',
                        'status' => false,
                        'message' => 'Error: ' . $e->getMessage()
                    ];
                }
            }
            
            // ============================================
            // TEST 3: Cek database exists
            // ============================================
            $database_exists = false;
            
            if ($mysqli_connect && $conn) {
                $result = $conn->query("SHOW DATABASES LIKE '$db_name'");
                $database_exists = $result && $result->num_rows > 0;
                
                $tests['database_exists'] = [
                    'name' => 'Database Exists',
                    'status' => $database_exists,
                    'message' => $database_exists 
                        ? "Database '$db_name' ditemukan" 
                        : "Database '$db_name' tidak ditemukan"
                ];
                
                if (!$database_exists) {
                    $tests['database_exists']['help'] = "Jalankan file database.sql untuk membuat database";
                }
            }
            
            // ============================================
            // TEST 4: Cek tabel-tabel
            // ============================================
            if ($database_exists) {
                $conn->select_db($db_name);
                
                $required_tables = ['users', 'surat_masuk', 'surat_keluar', 'inventaris', 'activity_log'];
                $existing_tables = [];
                
                $result = $conn->query("SHOW TABLES");
                while ($row = $result->fetch_array()) {
                    $existing_tables[] = $row[0];
                }
                
                $missing_tables = array_diff($required_tables, $existing_tables);
                
                $tests['database_tables'] = [
                    'name' => 'Tabel Database',
                    'status' => empty($missing_tables),
                    'message' => empty($missing_tables) 
                        ? 'Semua tabel tersedia (' . count($existing_tables) . ' tabel)' 
                        : 'Tabel tidak lengkap',
                    'info' => [
                        'Total Tables' => count($existing_tables),
                        'Required Tables' => implode(', ', $required_tables),
                        'Missing Tables' => empty($missing_tables) ? 'None' : implode(', ', $missing_tables)
                    ]
                ];
            }
            
            // ============================================
            // TEST 5: Cek folder uploads
            // ============================================
            $upload_dir = __DIR__ . '/uploads/';
            $uploads_exists = file_exists($upload_dir);
            $uploads_writable = $uploads_exists && is_writable($upload_dir);
            
            $tests['upload_folder'] = [
                'name' => 'Folder Uploads',
                'status' => $uploads_exists && $uploads_writable,
                'message' => $uploads_exists 
                    ? ($uploads_writable ? 'Folder uploads exists dan writable' : 'Folder uploads tidak writable')
                    : 'Folder uploads belum dibuat',
                'help' => !$uploads_writable ? 'Buat folder uploads dengan: mkdir uploads && chmod 777 uploads' : null
            ];
            
            // ============================================
            // TEST 6: PHP Version
            // ============================================
            $php_version = phpversion();
            $php_ok = version_compare($php_version, '7.4.0', '>=');
            
            $tests['php_version'] = [
                'name' => 'PHP Version',
                'status' => $php_ok,
                'message' => $php_ok 
                    ? "PHP $php_version (OK)" 
                    : "PHP $php_version (Minimal PHP 7.4 dibutuhkan)",
                'info' => [
                    'Current Version' => $php_version,
                    'Required' => '>= 7.4.0'
                ]
            ];
            
            // Close connection
            if ($conn) {
                $conn->close();
            }
            
            // ============================================
            // TAMPILKAN HASIL
            // ============================================
            $all_passed = true;
            foreach ($tests as $test) {
                if (!$test['status']) {
                    $all_passed = false;
                    break;
                }
            }
            ?>
            
            <!-- Overall Status -->
            <div class="test-section">
                <h3>
                    <span class="icon"><?php echo $all_passed ? '✅' : '❌'; ?></span>
                    Status Keseluruhan
                </h3>
                <div class="status <?php echo $all_passed ? 'success' : 'error'; ?>">
                    <?php if ($all_passed): ?>
                        ✓ Semua test berhasil! Aplikasi siap digunakan.
                    <?php else: ?>
                        ✗ Ada masalah yang perlu diperbaiki
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Detailed Tests -->
            <?php foreach ($tests as $test): ?>
            <div class="test-section">
                <h3>
                    <span class="icon"><?php echo $test['status'] ? '✅' : '❌'; ?></span>
                    <?php echo $test['name']; ?>
                </h3>
                
                <div class="status <?php echo $test['status'] ? 'success' : 'error'; ?>">
                    <?php echo $test['status'] ? '✓' : '✗'; ?>
                    <?php echo $test['message']; ?>
                </div>
                
                <?php if (isset($test['info']) && is_array($test['info'])): ?>
                    <div class="info-grid">
                        <?php foreach ($test['info'] as $label => $value): ?>
                            <div class="info-item">
                                <label><?php echo $label; ?></label>
                                <div class="value"><?php echo $value; ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                
                <?php if (isset($test['help'])): ?>
                    <div class="error-detail">
                        <strong>💡 Solusi:</strong> <?php echo $test['help']; ?>
                    </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
            
            <!-- System Information -->
            <div class="test-section">
                <h3>
                    <span class="icon">ℹ️</span>
                    Informasi Sistem
                </h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>PHP Version</label>
                        <div class="value"><?php echo PHP_VERSION; ?></div>
                    </div>
                    <div class="info-item">
                        <label>Server Software</label>
                        <div class="value"><?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?></div>
                    </div>
                    <div class="info-item">
                        <label>PHP SAPI</label>
                        <div class="value"><?php echo php_sapi_name(); ?></div>
                    </div>
                    <div class="info-item">
                        <label>Max Upload Size</label>
                        <div class="value"><?php echo ini_get('upload_max_filesize'); ?></div>
                    </div>
                </div>
            </div>
            
            <!-- Requirements -->
            <?php if (!$all_passed): ?>
            <div class="requirements">
                <h4>📋 Requirements Checklist:</h4>
                <ul>
                    <li>✅ Install XAMPP/WAMP/LAMP dengan PHP 7.4+ dan MySQL 5.7+</li>
                    <li>✅ Aktifkan extension mysqli di php.ini</li>
                    <li>✅ Start service Apache dan MySQL</li>
                    <li>✅ Buat database dengan menjalankan <code>database.sql</code></li>
                    <li>✅ Sesuaikan kredensial di <code>config.php</code></li>
                    <li>✅ Buat folder <code>uploads</code> dengan permission 777</li>
                </ul>
            </div>
            <?php endif; ?>
            
            <!-- Actions -->
            <div class="actions">
                <?php if ($all_passed): ?>
                    <a href="login.php" class="btn btn-primary">
                        🚀 Buka Aplikasi
                    </a>
                <?php else: ?>
                    <a href="setup.php" class="btn btn-primary">
                        🔧 Setup Wizard
                    </a>
                <?php endif; ?>
                <a href="test_connection.php" class="btn btn-secondary">
                    🔄 Refresh Test
                </a>
            </div>
        </div>
    </div>
</body>
</html>
