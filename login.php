<?php
require_once 'config.php';

$error = '';
$success = '';

// Handle logout message
if (isset($_GET['timeout']) && $_GET['timeout'] == 1) {
    $error = 'Sesi Anda telah berakhir. Silakan login kembali.';
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username']);
    $password = $_POST['password'];
    
    if (empty($username) || empty($password)) {
        $error = 'Username dan password harus diisi!';
    } else {
        $sql = "SELECT id, username, password, nama_lengkap, email, role, is_active FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Cek apakah user aktif
            if ($user['is_active'] != 1) {
                $error = 'Akun Anda tidak aktif. Hubungi administrator.';
            } 
            // Verifikasi password
            elseif (password_verify($password, $user['password'])) {
                // Set session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
                $_SESSION['role'] = $user['role'];
                
                // Update last login
                $update_sql = "UPDATE users SET last_login = NOW() WHERE id = ?";
                $update_stmt = $conn->prepare($update_sql);
                $update_stmt->bind_param("i", $user['id']);
                $update_stmt->execute();
                $update_stmt->close();
                
                // Log activity
                logActivity('LOGIN', 'users', $user['id'], 'User login: ' . $username);
                
                // Redirect ke dashboard
                header("Location: dashboard.php");
                exit();
            } else {
                $error = 'Username atau password salah!';
                
                // Log failed login attempt
                logActivity('LOGIN_FAILED', 'users', null, 'Failed login attempt for username: ' . $username);
            }
        } else {
            $error = 'Username atau password salah!';
        }
        
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Arsip PR IPNU IPPNU</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        
        .gradient-green {
            background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
        }
        
        .logo-watermark {
            opacity: 0.1;
            position: absolute;
            width: 200px;
            height: 200px;
        }
        
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        .logo-circle {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .logo-circle img {
            width: 50px;
            height: 50px;
        }
    </style>
</head>
<body class="gradient-green min-h-screen flex items-center justify-center p-4">
    
    <!-- Logo Watermark Background -->
    <div class="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div class="logo-watermark text-white text-9xl font-bold animate-float">IPNU</div>
    </div>
    
    <!-- Login Card -->
    <div class="w-full max-w-md relative z-10">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            <!-- Header dengan Logo -->
            <div class="gradient-green p-8 text-center relative overflow-hidden">
                <!-- Decorative circles -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div class="relative z-10">
                    <div class="flex justify-center gap-4 mb-6">
                        <div class="logo-circle">
                            <span class="text-green-600 font-bold text-lg">IPNU</span>
                        </div>
                        <div class="logo-circle">
                            <span class="text-green-600 font-bold text-lg">IPPNU</span>
                        </div>
                    </div>
                    <h1 class="text-2xl font-bold text-white mb-2">Sistem Arsip Digital</h1>
                    <p class="text-green-100 text-sm">PR IPNU IPPNU DESA CURUG</p>
                    <div class="mt-4 inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs text-white">
                        <span class="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2"></span>
                        Version <?php echo APP_VERSION; ?>
                    </div>
                </div>
            </div>
            
            <!-- Form Login -->
            <div class="p-8">
                
                <?php if ($error): ?>
                <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <div>
                        <p class="text-red-800 font-semibold text-sm">Error!</p>
                        <p class="text-red-600 text-sm"><?php echo $error; ?></p>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if ($success): ?>
                <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p class="text-green-600 text-sm"><?php echo $success; ?></p>
                </div>
                <?php endif; ?>
                
                <form method="POST" action="" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                            </svg>
                            Username
                        </label>
                        <input 
                            type="text" 
                            name="username" 
                            required
                            autofocus
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition"
                            placeholder="Masukkan username"
                        >
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                            </svg>
                            Password
                        </label>
                        <input 
                            type="password" 
                            name="password" 
                            required
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition"
                            placeholder="Masukkan password"
                        >
                    </div>
                    
                    <button 
                        type="submit"
                        class="w-full gradient-green text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Login
                    </button>
                </form>
                
                <!-- Info default account -->
                <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <p class="text-xs text-green-900 font-bold mb-2">Akun Default untuk Testing:</p>
                            <div class="space-y-1">
                                <p class="text-xs text-green-800">
                                    <span class="font-semibold">Admin:</span> 
                                    <code class="bg-white px-2 py-0.5 rounded text-green-700">admin</code> / 
                                    <code class="bg-white px-2 py-0.5 rounded text-green-700">admin123</code>
                                </p>
                                <p class="text-xs text-green-800">
                                    <span class="font-semibold">User:</span> 
                                    <code class="bg-white px-2 py-0.5 rounded text-green-700">user</code> / 
                                    <code class="bg-white px-2 py-0.5 rounded text-green-700">user123</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Links -->
                <div class="mt-6 flex justify-center gap-4 text-xs text-gray-500">
                    <a href="test_connection.php" class="hover:text-green-600 transition">
                        <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                        </svg>
                        Test Connection
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="text-center mt-6">
            <p class="text-white text-sm drop-shadow-lg">
                &copy; <?php echo date('Y'); ?> PR IPNU IPPNU Desa Curug
            </p>
            <p class="text-green-100 text-xs mt-1">
                All rights reserved
            </p>
        </div>
    </div>
    
    <script>
        // Auto focus username input
        document.querySelector('input[name="username"]').focus();
        
        // Add enter key handler
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.target.form?.submit();
            }
        });
    </script>
</body>
</html>
