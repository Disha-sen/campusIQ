# 🎓 CampusIQ - Campus Intelligence & Analytics Platform

A comprehensive educational data analytics system for tracking student performance, attendance, and placements.

![CampusIQ](https://img.shields.io/badge/CampusIQ-v1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

## ✨ Features

- **📊 Real-time Analytics Dashboard** - Comprehensive overview of student performance
- **📋 Attendance Tracking** - Subject-wise attendance management
- **⚠️ At-Risk Student Identification** - Early warning system for struggling students
- **💼 Placement Management** - Track placements and company statistics
- **📄 XML Import/Export** - Bulk data operations support
- **👥 Multi-role Access** - Admin, Faculty, and Student portals

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0+
- **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript ES6+
- **Charts:** Chart.js
- **Authentication:** JWT + SHA256

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Disha-sen/campusIQ.git
   cd campusIQ
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the backend folder:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=educational_analytics
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   mysql -u root -p < database/database.sql
   mysql -u root -p educational_analytics < database/seed_data.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eduanalytics.edu | demo123 |
| Faculty | sharma@eduanalytics.edu | demo123 |
| Student | rahul.sharma@student.edu | demo123 |

## 📁 Project Structure

```
campusIQ/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Authentication middleware
│   ├── routes/         # API routes
│   ├── server.js       # Main server file
│   └── package.json
├── database/
│   ├── database.sql    # Schema
│   └── seed_data.sql   # Sample data
├── public/
│   ├── admin/          # Admin dashboard
│   ├── faculty/        # Faculty dashboard
│   ├── student/        # Student dashboard
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── index.html      # Login page
└── README.md
```

## 🌐 Deployment on Render

1. Create a MySQL database on [PlanetScale](https://planetscale.com), [Railway](https://railway.app), or [Clever Cloud](https://clever-cloud.com)
2. Connect your GitHub repo to Render
3. Set environment variables in Render dashboard
4. Deploy!

## 👩‍💻 Developer

**Disha Sen**
- 📧 Email: disha0204sen@gmail.com
- 🐙 GitHub: [@Disha-sen](https://github.com/Disha-sen)

## 📄 License

This project is licensed under the MIT License.

---

© 2026 CampusIQ - Campus Intelligence & Analytics Platform | Developed by Disha Sen
