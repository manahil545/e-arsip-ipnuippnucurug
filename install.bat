@echo off
REM ============================================
REM Install Script untuk Windows
REM Aplikasi Arsip PR IPNU IPPNU Desa Curug
REM ============================================

color 0A
title Instalasi Arsip PR IPNU IPPNU

echo.
echo ================================================
echo    Instalasi Arsip PR IPNU IPPNU Desa Curug
echo ================================================
echo.

REM Cek apakah PHP terinstall
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] PHP tidak ditemukan!
    echo.
    echo Silakan install XAMPP atau PHP terlebih dahulu:
    echo - Download XAMPP: https://www.apachefriends.org/
    echo - Atau PHP: https://windows.php.net/download/
    echo.
    pause
    exit /b 1
)

echo [OK] PHP ditemukan
php -v | findstr /C:"PHP"
echo.

REM Cek apakah MySQL/MariaDB terinstall
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0E
    echo [WARNING] MySQL client tidak ditemukan
    echo Pastikan MySQL/MariaDB sudah terinstall
    echo.
) else (
    echo [OK] MySQL client ditemukan
    echo.
)

REM Cek file database.sql
if not exist "database.sql" (
    color 0C
    echo [ERROR] File database.sql tidak ditemukan!
    echo.
    pause
    exit /b 1
)

echo [OK] File database.sql ditemukan
echo.

REM Buat folder uploads
if not exist "uploads" (
    mkdir uploads
    echo [OK] Folder uploads dibuat
) else (
    echo [OK] Folder uploads sudah ada
)
echo.

REM Input konfigurasi database
echo ================================================
echo    Konfigurasi Database
echo ================================================
echo.

set /p DB_HOST="Host database [localhost]: " || set DB_HOST=localhost
set /p DB_USER="Username database [root]: " || set DB_USER=root
set /p DB_PASS="Password database: "
set /p DB_NAME="Nama database [arsip_ipnu_ippnu]: " || set DB_NAME=arsip_ipnu_ippnu

echo.
echo ================================================
echo    Menginstall Database
echo ================================================
echo.

REM Buat database
echo Membuat database...
mysql -h%DB_HOST% -u%DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS `%DB_NAME%` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Gagal membuat database!
    echo Periksa kredensial database Anda.
    echo.
    pause
    exit /b 1
)

echo [OK] Database berhasil dibuat
echo.

REM Import database
echo Mengimport database.sql...
mysql -h%DB_HOST% -u%DB_USER% -p%DB_PASS% %DB_NAME% < database.sql 2>nul

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Gagal mengimport database!
    echo.
    pause
    exit /b 1
)

echo [OK] Database berhasil diimport
echo.

REM Update config.php menggunakan PowerShell
echo Menyimpan konfigurasi...

powershell -Command "(gc config.php) -replace \"define\('DB_HOST', '.*?'\);\", \"define('DB_HOST', '%DB_HOST%');\" | Out-File -encoding ASCII config.php.tmp"
powershell -Command "(gc config.php.tmp) -replace \"define\('DB_USER', '.*?'\);\", \"define('DB_USER', '%DB_USER%');\" | Out-File -encoding ASCII config.php.tmp2"
powershell -Command "(gc config.php.tmp2) -replace \"define\('DB_PASS', '.*?'\);\", \"define('DB_PASS', '%DB_PASS%');\" | Out-File -encoding ASCII config.php.tmp3"
powershell -Command "(gc config.php.tmp3) -replace \"define\('DB_NAME', '.*?'\);\", \"define('DB_NAME', '%DB_NAME%');\" | Out-File -encoding ASCII config.php"

del config.php.tmp config.php.tmp2 config.php.tmp3 2>nul

echo [OK] Konfigurasi berhasil disimpan
echo.

REM Selesai
color 0A
echo ================================================
echo    [OK] Instalasi Selesai!
echo ================================================
echo.
echo Aplikasi berhasil diinstall dan siap digunakan.
echo.
echo Akun default:
echo   - Admin: username='admin', password='admin123'
echo   - User: username='user', password='user123'
echo.
echo [!] Segera ubah password default setelah login!
echo.
echo ================================================
echo    Cara Menggunakan
echo ================================================
echo.
echo XAMPP:
echo   1. Buka XAMPP Control Panel
echo   2. Start Apache dan MySQL
echo   3. Pindahkan folder aplikasi ke C:\xampp\htdocs\
echo   4. Akses: http://localhost/nama-folder/login.php
echo.
echo PHP Built-in Server (untuk testing):
echo   1. Buka command prompt di folder aplikasi
echo   2. Jalankan: php -S localhost:8000
echo   3. Akses: http://localhost:8000/login.php
echo.
echo Test Koneksi:
echo   - http://localhost/nama-folder/test_connection.php
echo.

REM Tanya apakah ingin menjalankan PHP server
set /p START_SERVER="Jalankan PHP built-in server sekarang? (Y/N): "

if /I "%START_SERVER%"=="Y" (
    echo.
    echo ================================================
    echo    Starting PHP Server
    echo ================================================
    echo.
    echo Server berjalan di: http://localhost:8000
    echo Tekan Ctrl+C untuk stop server
    echo.
    echo Silakan buka browser dan akses:
    echo http://localhost:8000/login.php
    echo.
    php -S localhost:8000
) else (
    echo.
    echo Untuk menjalankan server nanti, gunakan:
    echo php -S localhost:8000
    echo.
)

pause
