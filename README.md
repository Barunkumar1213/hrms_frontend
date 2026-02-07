# HRMS Lite – Frontend

## 📌 Project Overview

HRMS Lite is a lightweight Human Resource Management System frontend that allows users to:

- Add and manage employees
- View employee lists with pagination
- Mark and view attendance
- Prevent duplicate attendance per employee per day
- View attendance history and summaries

This frontend communicates with a FastAPI backend using REST APIs and provides a modern, responsive UI.

---

## 🧰 Tech Stack Used

- **React (Vite)** – Frontend framework
- **React Hook Form** – Form state management
- **Zod** – Schema-based form validation
- **Axios** – API communication
- **Bootstrap 5** – Responsive UI & layout
- **React Toastify** – Toast notifications
- **JavaScript (ES6+)**

---

## ▶️ Steps to Run the Frontend Locally

### 1️⃣ Prerequisites

Make sure you have:

- Node.js ≥ 18
- npm or yarn
- Backend server running on `http://127.0.0.1:8000`

---

### 2️⃣ Install Dependencies

```bash
npm install


start development server
npm run dev

open in browser
http://localhost:5173

```

⚠️ Assumptions & Limitations

Authentication & authorization are not implemented

No role-based access control (admin/user)

UI is optimized for small-to-medium datasets

Attendance summary is monthly (no yearly analytics yet)
