# 🚀 CRM Backend

<div align="center">

# Customer Relationship Management Backend

A powerful and scalable CRM Backend built using **Node.js**, **Express.js**, **MySQL**, and integrated with a **React Frontend** to help businesses manage customers, leads, sales pipelines, tasks, and team collaboration efficiently.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📖 Description

CRM Backend is a modern Customer Relationship Management system designed to simplify business operations by centralizing customer information, managing leads, tracking sales activities, and improving team productivity.

The backend exposes secure RESTful APIs that can be consumed by React applications, mobile apps, and third-party integrations.

---

## ✨ Features

### 👥 Customer Management
- Add, update, and delete customers
- Customer profile management
- Contact information storage
- Customer interaction history

### 🎯 Lead Management
- Lead generation tracking
- Lead assignment
- Lead status management
- Lead conversion tracking

### 💼 Sales Pipeline
- Opportunity tracking
- Deal management
- Revenue forecasting
- Sales performance monitoring

### 📋 Task Management
- Assign tasks to employees
- Track task progress
- Set priorities
- Due date reminders

### 🔐 Authentication & Authorization
- JWT Authentication
- Password Encryption
- Role-Based Access Control
- Secure Protected Routes

### 📊 Dashboard & Analytics
- Sales Reports
- Customer Insights
- Lead Conversion Metrics
- Activity Monitoring

### 📧 Communication Features
- Email Notifications
- Activity Logs
- Follow-Up Tracking

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- Bcrypt

## Frontend
- React.js
- Axios
- React Router
- Context API

## Development Tools
- Nodemon
- Postman
- Git
- GitHub

---

# 📦 NPM Packages

```bash
npm install express mysql2 sequelize dotenv cors helmet morgan bcryptjs jsonwebtoken express-validator multer
```

### Development Dependency

```bash
npm install --save-dev nodemon
```

---

# 📂 Folder Structure

```bash
CRM_BACKEND/
│
├── config/
│   └── db.js
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── services/
│
├── utils/
│
├── uploads/
│
├── database/
│
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_database

JWT_SECRET=your_super_secret_key

EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

# 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/crm-backend.git
```

### Navigate To Project

```bash
cd crm-backend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

---

# 🔗 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

## Customers

```http
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

## Leads

```http
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
```

## Tasks

```http
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

## Users

```http
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using Bcrypt
- Input Validation
- SQL Injection Prevention
- CORS Protection
- Helmet Security Headers
- Role-Based Authorization

---

# 📊 Database Design

### Main Tables

- Users
- Customers
- Leads
- Deals
- Tasks
- Activities
- Notifications

---

# 📈 Future Enhancements

- AI Lead Scoring
- Real-Time Notifications
- Mobile App Support
- WhatsApp Integration
- Calendar Integration
- Cloud Deployment
- Advanced Analytics Dashboard

---

# 🧪 Testing

```bash
npm test
```

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork the Project
2. Create Feature Branch

```bash
git checkout -b feature/new-feature
```

3. Commit Changes

```bash
git commit -m "Added new feature"
```

4. Push Changes

```bash
git push origin feature/new-feature
```

5. Open Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

## ❤️ Built with Node.js, MySQL & React

### Empowering Businesses Through Better Customer Relationships

⭐ Star this repository if you found it helpful!

</div>
