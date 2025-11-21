@echo off
echo ========================================
echo Setting up Railway Management Database
echo ========================================
echo.

REM Try different possible MySQL paths
set MYSQL_BIN=""

if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_BIN="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
)
if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
    set MYSQL_BIN="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
)
if exist "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe" (
    set MYSQL_BIN="C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe"
)

if %MYSQL_BIN%=="" (
    echo ERROR: MySQL not found!
    echo.
    echo Please use MySQL Workbench:
    echo 1. Open MySQL Workbench
    echo 2. Connect to Local instance
    echo 3. File -^> Open SQL Script
    echo 4. Select railway_management.sql
    echo 5. Click Execute (lightning icon)
    echo.
    pause
    exit
)

REM Change this if your MySQL root password is different
set MYSQL_PASSWORD=Yogesh@143

echo Found MySQL at: %MYSQL_BIN%
echo Executing railway_management.sql...
echo.

%MYSQL_BIN% -u root -p%MYSQL_PASSWORD% < "railway_management.sql" 2>&1

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database setup completed successfully!
    echo ========================================
    echo.
    echo The following has been created:
    echo - Database: railway_management
    echo - 10 Tables with sample data (5 passengers, 5 trains, 10 stations)
    echo - 12 Triggers (validation, audit, discounts)
    echo - 4 Functions (fare calculation, balance checks)
    echo - 7 Stored Procedures (booking, search, reports)
    echo.
    echo Now refresh your browser to see the data!
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database setup failed!
    echo ========================================
    echo.
    echo Please try using MySQL Workbench instead:
    echo 1. Open MySQL Workbench
    echo 2. Connect to your local MySQL server
    echo 3. File -^> Open SQL Script
    echo 4. Select: railway_management.sql
    echo 5. Click Execute (lightning bolt icon)
    echo.
)

pause
