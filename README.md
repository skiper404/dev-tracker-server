# 🚀 Dev-Tracker Server

Backend server for the **Dev-Tracker** application. The project uses **Node.js**, **Express**, and **MongoDB** for data storage.

---

## ⚙️ Technologies & Dependencies

- **Node.js**
- **Express**
- **MongoDB**
- **dotenv** — environment variables
- **bcrypt** — password hashing
- **express-validator** — request validation
- **jsonwebtoken** — JWT auth
- **resend** — email sending
- **winston** & **winston-daily-rotate-file** — logging
- **cors** — cross-origin resource sharing

**Dev Dependencies:**

- **nodemon** — auto-restart server in development
- **morgan** — HTTP request logger

---

## 🚀 Installation & Running

1. Clone the repository:

```bash
git clone <repo-url>
cd <project-folder>
```

2. Install dependencies:

```bash
npm install
```
3. Create a .env file in the project root (example):

```bash
PORT=3000
MONGO_URL=mongodb://localhost:27017/devtracker
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
```
4. Start the server in development mode:

```bash
npm run dev
```
