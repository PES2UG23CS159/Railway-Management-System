# Database Setup Script for Railway Reservation System
# Run this script after installing MySQL

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Railway Reservation - Database Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is installed
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue

if (-not $mysqlPath) {
    Write-Host "ERROR: MySQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MySQL first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://dev.mysql.com/downloads/installer/" -ForegroundColor Yellow
    Write-Host "2. Or install XAMPP: https://www.apachefriends.org/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, add MySQL to PATH or use:" -ForegroundColor Yellow
    Write-Host '  C:\xampp\mysql\bin\mysql.exe (for XAMPP)' -ForegroundColor Yellow
    Write-Host '  C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe (for MySQL Installer)' -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ MySQL found at: $($mysqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Get MySQL credentials
$mysqlUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Enter MySQL password" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
)

Write-Host ""
Write-Host "Importing database..." -ForegroundColor Yellow

# Check if tables_only.sql exists
if (-not (Test-Path "tables_only.sql")) {
    Write-Host "ERROR: tables_only.sql not found in current directory" -ForegroundColor Red
    Write-Host "Please make sure you're in the correct directory" -ForegroundColor Red
    exit 1
}

# Import the database
try {
    if ([string]::IsNullOrWhiteSpace($mysqlPasswordPlain)) {
        mysql -u $mysqlUser < tables_only.sql
    } else {
        mysql -u $mysqlUser -p$mysqlPasswordPlain < tables_only.sql
    }
    
    Write-Host ""
    Write-Host "✓ Database imported successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Navigate to backend: cd train-reservation-app\backend" -ForegroundColor White
    Write-Host "2. Install dependencies: npm install" -ForegroundColor White
    Write-Host "3. Configure .env file with your MySQL credentials" -ForegroundColor White
    Write-Host "4. Start server: npm start" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to import database" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Try manually using MySQL Workbench or phpMyAdmin" -ForegroundColor Yellow
}
