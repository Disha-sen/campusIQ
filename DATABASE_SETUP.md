# Educational Data Analytics System - Database Setup Guide

## MySQL Installation Required

The XAMPP installation on your system is incomplete (mysql binaries missing).

### Option 1: Install XAMPP with MySQL (Recommended)

1. Download XAMPP from: https://www.apachefriends.org/download.html
2. Run the installer and select MySQL/MariaDB
3. After installation, open XAMPP Control Panel
4. Start Apache and MySQL services
5. Run the setup script below

### Option 2: Install MySQL Server Directly

1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and note your root password
3. Start MySQL Service from Windows Services

---

## Database Setup Steps

Once MySQL is running, execute these commands:

### Via MySQL Command Line:

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE educational_analytics;
USE educational_analytics;

# Execute schema (paste the contents of database/database.sql)
SOURCE C:/Users/lenovo/Desktop/disha project 2/database/database.sql;

# Load sample data
SOURCE C:/Users/lenovo/Desktop/disha project 2/database/seed_data.sql;
```

### Via phpMyAdmin (if using XAMPP):

1. Open http://localhost/phpmyadmin
2. Create new database: `educational_analytics`
3. Import `database/database.sql`
4. Import `database/seed_data.sql`

---

## After Database Setup

1. Update `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=educational_analytics
```

2. Start the server:

```bash
cd backend
npm run dev
```

3. Open http://localhost:3000
