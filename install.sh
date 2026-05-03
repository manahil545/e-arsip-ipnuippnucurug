#!/bin/bash

##############################################
# Install Script untuk Linux/Mac
# Aplikasi Arsip PR IPNU IPPNU Desa Curug
##############################################

echo "╔════════════════════════════════════════════════╗"
echo "║   Instalasi Arsip PR IPNU IPPNU Desa Curug    ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Warna untuk output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Cek apakah PHP terinstall
echo "Mengecek requirements..."
echo ""

if ! command -v php &> /dev/null; then
    print_error "PHP tidak ditemukan!"
    print_info "Install PHP terlebih dahulu:"
    echo "  Ubuntu/Debian: sudo apt-get install php php-mysql php-mbstring"
    echo "  CentOS/RHEL: sudo yum install php php-mysqlnd php-mbstring"
    echo "  macOS: brew install php"
    exit 1
fi

print_success "PHP ditemukan: $(php -v | head -n 1)"

# Cek versi PHP
PHP_VERSION=$(php -r "echo PHP_VERSION;")
REQUIRED_VERSION="7.4.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PHP_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "PHP version $PHP_VERSION terlalu lama. Minimal PHP 7.4.0"
    exit 1
fi

print_success "PHP version memenuhi requirements"

# Cek MySQL
if ! command -v mysql &> /dev/null; then
    print_warning "MySQL client tidak ditemukan"
    print_info "Install MySQL/MariaDB terlebih dahulu jika belum ada"
else
    print_success "MySQL client ditemukan"
fi

# Cek extension yang diperlukan
echo ""
echo "Mengecek PHP extensions..."

check_extension() {
    if php -m | grep -q "^$1$"; then
        print_success "Extension $1 tersedia"
        return 0
    else
        print_error "Extension $1 tidak tersedia"
        return 1
    fi
}

EXTENSIONS_OK=true

check_extension "mysqli" || EXTENSIONS_OK=false
check_extension "mbstring" || EXTENSIONS_OK=false
check_extension "fileinfo" || EXTENSIONS_OK=false

if [ "$EXTENSIONS_OK" = false ]; then
    print_error "Beberapa PHP extension tidak tersedia"
    print_info "Install dengan: sudo apt-get install php-mysql php-mbstring"
    exit 1
fi

# Buat folder uploads
echo ""
echo "Membuat folder uploads..."

if [ ! -d "uploads" ]; then
    mkdir -p uploads
    chmod 777 uploads
    print_success "Folder uploads dibuat"
else
    print_success "Folder uploads sudah ada"
fi

# Cek file database.sql
echo ""
if [ ! -f "database.sql" ]; then
    print_error "File database.sql tidak ditemukan!"
    exit 1
fi

print_success "File database.sql ditemukan"

# Tanya kredensial database
echo ""
echo "════════════════════════════════════════"
echo "   Konfigurasi Database"
echo "════════════════════════════════════════"
echo ""

read -p "Host database [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Username database [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Password database: " DB_PASS
echo ""

read -p "Nama database [arsip_ipnu_ippnu]: " DB_NAME
DB_NAME=${DB_NAME:-arsip_ipnu_ippnu}

# Test koneksi
echo ""
echo "Testing koneksi database..."

if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &> /dev/null; then
    print_success "Koneksi database berhasil"
else
    print_error "Koneksi database gagal!"
    print_info "Periksa kredensial database Anda"
    exit 1
fi

# Buat database
echo ""
echo "Membuat database..."

mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Database '$DB_NAME' dibuat"
else
    print_error "Gagal membuat database"
    exit 1
fi

# Import database
echo ""
echo "Mengimport database.sql..."

mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < database.sql 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Database berhasil diimport"
else
    print_error "Gagal mengimport database"
    exit 1
fi

# Update config.php
echo ""
echo "Menyimpan konfigurasi ke config.php..."

if [ -f "config.php" ]; then
    # Backup config.php yang lama
    cp config.php config.php.backup
    
    # Update kredensial di config.php
    sed -i.bak "s/define('DB_HOST', '.*');/define('DB_HOST', '$DB_HOST');/" config.php
    sed -i.bak "s/define('DB_USER', '.*');/define('DB_USER', '$DB_USER');/" config.php
    sed -i.bak "s/define('DB_PASS', '.*');/define('DB_PASS', '$DB_PASS');/" config.php
    sed -i.bak "s/define('DB_NAME', '.*');/define('DB_NAME', '$DB_NAME');/" config.php
    
    # Hapus backup file
    rm -f config.php.bak
    
    print_success "Konfigurasi disimpan"
else
    print_error "File config.php tidak ditemukan"
    exit 1
fi

# Cek web server
echo ""
echo "════════════════════════════════════════"
echo "   Informasi Web Server"
echo "════════════════════════════════════════"
echo ""

if command -v apache2 &> /dev/null || command -v httpd &> /dev/null; then
    print_info "Apache terdeteksi"
    print_info "Pastikan DocumentRoot mengarah ke folder aplikasi ini"
elif command -v nginx &> /dev/null; then
    print_info "Nginx terdeteksi"
    print_info "Pastikan root direktori mengarah ke folder aplikasi ini"
else
    print_warning "Web server tidak terdeteksi"
    print_info "Anda bisa menggunakan PHP built-in server untuk testing:"
    echo "  php -S localhost:8000"
fi

# Selesai
echo ""
echo "════════════════════════════════════════"
echo "   ✓ Instalasi Selesai!"
echo "════════════════════════════════════════"
echo ""
print_success "Aplikasi berhasil diinstall"
echo ""
print_info "Akun default:"
echo "  • Admin: username='admin', password='admin123'"
echo "  • User: username='user', password='user123'"
echo ""
print_warning "Segera ubah password default setelah login!"
echo ""
print_info "Akses aplikasi:"
echo "  • Via web server: http://localhost/path-to-app/login.php"
echo "  • Via PHP server: php -S localhost:8000 kemudian buka http://localhost:8000/login.php"
echo ""
print_info "Test koneksi: http://localhost/path-to-app/test_connection.php"
echo ""

# Tanya apakah ingin start PHP server
read -p "Ingin menjalankan PHP built-in server? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting PHP server di http://localhost:8000"
    print_info "Tekan Ctrl+C untuk stop server"
    echo ""
    php -S localhost:8000
fi
