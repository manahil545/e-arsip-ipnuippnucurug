<?php
/**
 * Setup Wizard untuk Instalasi Aplikasi
 * Membantu setup database dan konfigurasi awal
 */

session_start();

$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
$max_steps = 4;

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['step'])) {
        $current_step = (int)$_POST['step'];
        
        switch ($current_step) {
            case 1:
                // Save database configuration
                $_SESSION['setup'] = [
                    'db_host' => $_POST['db_host'],
                    'db_user' => $_POST['db_user'],
                    'db_pass' => $_POST['db_pass'],
                    'db_name' => $_POST['db_name']
                ];
                header("Location: setup.php?step=2");
                exit();
                
            case 2:
                // Test connection and create database
                $setup = $_SESSION['setup'];
                
                try {
                    $conn = new mysqli($setup['db_host'], $setup['db_user'], $setup['db_pass']);
                    
                    if ($conn->connect_error) {
                        throw new Exception("Koneksi gagal: " . $conn->connect_error);
                    }
                    
                    // Create database if not exists
                    $db_name = $conn->real_escape_string($setup['db_name']);
                    $conn->query("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                    
                    // Select database
                    $conn->select_db($db_name);
                    
                    // Read and execute SQL file
                    $sql_file = __DIR__ . '/database.sql';
                    if (file_exists($sql_file)) {
                        $sql_content = file_get_contents($sql_file);
                        
                        // Split queries
                        $queries = array_filter(array_map('trim', explode(';', $sql_content)));
                        
                        foreach ($queries as $query) {
                            if (!empty($query) && !preg_match('/^(--|DROP DATABASE)/', $query)) {
                                $conn->query($query);
                            }
                        }
                    }
                    
                    $conn->close();
                    
                    $_SESSION['setup_success'] = true;
                    header("Location: setup.php?step=3");
                    exit();
                    
                } catch (Exception $e) {
                    $_SESSION['setup_error'] = $e->getMessage();
                    header("Location: setup.php?step=2");
                    exit();
                }
                
            case 3:
                // Save config.php
                $setup = $_SESSION['setup'];
                
                $config_content = file_get_contents(__DIR__ . '/config.php');
                
                // Replace database credentials
                $config_content = preg_replace(
                    "/define\('DB_HOST', '.*?'\);/",
                    "define('DB_HOST', '{$setup['db_host']}');",
                    $config_content
                );
                $config_content = preg_replace(
                    "/define\('DB_USER', '.*?'\);/",
                    "define('DB_USER', '{$setup['db_user']}');",
                    $config_content
                );
                $config_content = preg_replace(
                    "/define\('DB_PASS', '.*?'\);/",
                    "define('DB_PASS', '{$setup['db_pass']}');",
                    $config_content
                );
                $config_content = preg_replace(
                    "/define\('DB_NAME', '.*?'\);/",
                    "define('DB_NAME', '{$setup['db_name']}');",
                    $config_content
                );
                
                file_put_contents(__DIR__ . '/config.php', $config_content);
                
                // Create uploads folder
                $upload_dir = __DIR__ . '/uploads/';
                if (!file_exists($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }
                
                header("Location: setup.php?step=4");
                exit();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Wizard - Arsip PR IPNU IPPNU</title>
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
        
        .wizard-container {
            background: white;
            max-width: 700px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .wizard-header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .wizard-header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .step-indicator {
            display: flex;
            justify-content: space-between;
            padding: 30px;
            background: #f8f9fa;
        }
        
        .step {
            flex: 1;
            text-align: center;
            position: relative;
        }
        
        .step::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 50%;
            width: 100%;
            height: 2px;
            background: #d1d5db;
            z-index: 0;
        }
        
        .step:last-child::after {
            display: none;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #d1d5db;
            color: #6b7280;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            position: relative;
            z-index: 1;
            margin-bottom: 8px;
        }
        
        .step.active .step-number {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
        }
        
        .step.completed .step-number {
            background: #10b981;
            color: white;
        }
        
        .step-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
        }
        
        .wizard-content {
            padding: 40px;
        }
        
        .step-title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .step-description {
            color: #6b7280;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #10b981;
        }
        
        .form-help {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
        }
        
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        
        .alert-error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        
        .alert-info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
        }
        
        .wizard-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
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
            font-size: 14px;
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
        
        .success-icon {
            text-align: center;
            font-size: 80px;
            margin-bottom: 20px;
        }
        
        .checklist {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .checklist-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
        }
        
        .checklist-item .icon {
            color: #10b981;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="wizard-container">
        <div class="wizard-header">
            <h1>🚀 Setup Wizard</h1>
            <p>Aplikasi Arsip PR IPNU IPPNU Desa Curug</p>
        </div>
        
        <div class="step-indicator">
            <div class="step <?php echo $step >= 1 ? ($step > 1 ? 'completed' : 'active') : ''; ?>">
                <div class="step-number">1</div>
                <div class="step-label">Database</div>
            </div>
            <div class="step <?php echo $step >= 2 ? ($step > 2 ? 'completed' : 'active') : ''; ?>">
                <div class="step-number">2</div>
                <div class="step-label">Install</div>
            </div>
            <div class="step <?php echo $step >= 3 ? ($step > 3 ? 'completed' : 'active') : ''; ?>">
                <div class="step-number">3</div>
                <div class="step-label">Config</div>
            </div>
            <div class="step <?php echo $step >= 4 ? 'active' : ''; ?>">
                <div class="step-number">4</div>
                <div class="step-label">Selesai</div>
            </div>
        </div>
        
        <div class="wizard-content">
            <?php if ($step == 1): ?>
                <!-- Step 1: Database Configuration -->
                <h2 class="step-title">Konfigurasi Database</h2>
                <p class="step-description">Masukkan informasi koneksi database MySQL Anda</p>
                
                <form method="POST" action="setup.php">
                    <input type="hidden" name="step" value="1">
                    
                    <div class="form-group">
                        <label>Host Database</label>
                        <input type="text" name="db_host" value="localhost" required>
                        <div class="form-help">Biasanya: localhost atau 127.0.0.1</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Username Database</label>
                        <input type="text" name="db_user" value="root" required>
                        <div class="form-help">Username MySQL Anda (default: root)</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Password Database</label>
                        <input type="password" name="db_pass" value="">
                        <div class="form-help">Password MySQL (kosongkan jika tidak ada)</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Nama Database</label>
                        <input type="text" name="db_name" value="arsip_ipnu_ippnu" required>
                        <div class="form-help">Nama database yang akan dibuat</div>
                    </div>
                    
                    <div class="wizard-actions">
                        <button type="submit" class="btn btn-primary">
                            Lanjut →
                        </button>
                    </div>
                </form>
                
            <?php elseif ($step == 2): ?>
                <!-- Step 2: Installation -->
                <h2 class="step-title">Instalasi Database</h2>
                <p class="step-description">Membuat database dan tabel-tabel yang diperlukan</p>
                
                <?php if (isset($_SESSION['setup_error'])): ?>
                    <div class="alert alert-error">
                        <strong>Error:</strong> <?php echo $_SESSION['setup_error']; ?>
                    </div>
                    <div class="wizard-actions">
                        <a href="setup.php?step=1" class="btn btn-secondary">← Kembali</a>
                    </div>
                    <?php unset($_SESSION['setup_error']); ?>
                <?php else: ?>
                    <div class="alert alert-info">
                        <strong>Perhatian:</strong> Proses ini akan membuat database baru dan menginstall semua tabel yang diperlukan.
                    </div>
                    
                    <div class="checklist">
                        <div class="checklist-item">
                            <span class="icon">✓</span>
                            <span>Membuat database</span>
                        </div>
                        <div class="checklist-item">
                            <span class="icon">✓</span>
                            <span>Membuat tabel users, surat_masuk, surat_keluar, inventaris</span>
                        </div>
                        <div class="checklist-item">
                            <span class="icon">✓</span>
                            <span>Insert data default (user admin & user biasa)</span>
                        </div>
                        <div class="checklist-item">
                            <span class="icon">✓</span>
                            <span>Setup views dan triggers</span>
                        </div>
                    </div>
                    
                    <form method="POST" action="setup.php">
                        <input type="hidden" name="step" value="2">
                        <div class="wizard-actions">
                            <a href="setup.php?step=1" class="btn btn-secondary">← Kembali</a>
                            <button type="submit" class="btn btn-primary">
                                Install Database →
                            </button>
                        </div>
                    </form>
                <?php endif; ?>
                
            <?php elseif ($step == 3): ?>
                <!-- Step 3: Save Configuration -->
                <h2 class="step-title">Menyimpan Konfigurasi</h2>
                <p class="step-description">Menyimpan pengaturan ke file konfigurasi</p>
                
                <?php if (isset($_SESSION['setup_success'])): ?>
                    <div class="alert alert-success">
                        <strong>Berhasil!</strong> Database berhasil diinstall.
                    </div>
                    <?php unset($_SESSION['setup_success']); ?>
                <?php endif; ?>
                
                <div class="alert alert-info">
                    Konfigurasi akan disimpan ke file <code>config.php</code> dan folder uploads akan dibuat.
                </div>
                
                <form method="POST" action="setup.php">
                    <input type="hidden" name="step" value="3">
                    <div class="wizard-actions">
                        <button type="submit" class="btn btn-primary">
                            Simpan & Lanjut →
                        </button>
                    </div>
                </form>
                
            <?php elseif ($step == 4): ?>
                <!-- Step 4: Complete -->
                <div class="success-icon">🎉</div>
                <h2 class="step-title" style="text-align: center;">Setup Selesai!</h2>
                <p class="step-description" style="text-align: center;">Aplikasi berhasil diinstall dan siap digunakan</p>
                
                <div class="alert alert-success">
                    <strong>Selamat!</strong> Instalasi berhasil diselesaikan.
                </div>
                
                <div class="checklist">
                    <h3 style="margin-bottom: 15px;">📝 Akun Default:</h3>
                    <div class="checklist-item">
                        <span class="icon">👤</span>
                        <span><strong>Admin:</strong> username: <code>admin</code>, password: <code>admin123</code></span>
                    </div>
                    <div class="checklist-item">
                        <span class="icon">👤</span>
                        <span><strong>User:</strong> username: <code>user</code>, password: <code>user123</code></span>
                    </div>
                </div>
                
                <div class="alert alert-info" style="margin-top: 20px;">
                    <strong>⚠️ Penting:</strong> Segera ubah password default setelah login pertama kali!
                </div>
                
                <div class="wizard-actions">
                    <a href="test_connection.php" class="btn btn-secondary">
                        🔍 Test Connection
                    </a>
                    <a href="login.php" class="btn btn-primary">
                        🚀 Buka Aplikasi
                    </a>
                </div>
                
                <?php
                // Clear session
                unset($_SESSION['setup']);
                ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
