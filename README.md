<div align="center">

<img src="public/images/logo.png" alt="Inventra Logo" width="120" />

# Inventra

### Smart Inventory & Billing Management System

**ছোট ও মাঝারি ব্যবসার জন্য — স্টক ট্র্যাক করুন, ইনভয়েস বানান, ব্যবসা বুঝুন।**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Inventra-4F46E5?style=for-the-badge)](https://inventra-sandy.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 🧩 Problem → Solution

> **সমস্যা:** বেশিরভাগ ছোট ব্যবসা এখনো Excel বা খাতায় স্টক হিসাব রাখে। ফলে কোন পণ্য শেষ হয়ে গেছে, কোন কাস্টমার বাকি রেখেছে — এসব বোঝা কঠিন হয়ে যায়।
>
> **সমাধান:** Inventra একটি all-in-one dashboard যেখানে real-time স্টক আপডেট, automatic invoice generation, এবং customer due tracking — সব এক জায়গায়।

---

## 📸 Preview

### Dashboard Overview
![Dashboard](public/images/1.png)

### Inventory Management
![Inventory](public/images/2.png)

### Billing & Invoice
![Billing](public/images/3.png)

---

## ✨ Key Features

### 📦 Inventory Management
- Real-time stock tracking with **low stock alerts**
- Add, edit, delete products securely
- Unit-based stock system (kg, pcs, litre, etc.)
- Admin-only write access — no accidental edits

### 🧾 Smart Billing System
- Generate professional invoices in seconds
- Automatic total calculation — zero manual math
- Track **Paid vs Due** amounts per customer
- Full billing history with invoice preview

### 👥 Customer Management
- Customer profiles with purchase history
- Instant search across all customers
- Due amount tracking per customer
- Customer-level analytics

### 📊 Business Analytics Dashboard
- Total revenue & sales at a glance
- Low stock monitoring alerts
- Customer statistics overview
- Business performance insights — all in one screen

### 🔐 Authentication & Security
- Secure **Google OAuth** login
- **JWT-based** protected APIs (JOSE verification)
- Role-based access control (Admin vs User)
- Admin-only inventory controls

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **UI Components** | Shadcn UI, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | Better Auth, JWT (JOSE), Google OAuth |
| **Hosting** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google OAuth credentials

### Installation

**১. Repository clone করুন:**
```bash
git clone https://github.com/YOUR_USERNAME/inventra.git
cd inventra
```

**২. Dependencies install করুন:**
```bash
npm install
```

**৩. Environment variables সেট করুন:**

`.env.local` ফাইল বানান এবং নিচের values দিন:

```env
NEXT_PUBLIC_SERVER_URL=your_server_url
MONGODB_URI=your_mongodb_atlas_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BETTER_AUTH_SECRET=your_random_secret_key
```

**৪. Development server চালু করুন:**
```bash
npm run dev
```

অ্যাপ চলবে: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
inventra/
├── public/
│   └── images/          # Screenshots & logo
│
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions & DB config
│   ├── hooks/           # Custom React hooks
│   └── services/        # API call functions
│
├── server/              # Express.js backend
├── .env.local           # Environment variables (not committed)
└── package.json
```

---

## 🔒 Role-Based Access

| Feature | Regular User | Admin |
|---|---|---|
| View Dashboard | ✅ | ✅ |
| View Inventory | ✅ | ✅ |
| Add Products | ❌ | ✅ |
| Edit Products | ❌ | ✅ |
| Delete Products | ❌ | ✅ |
| Create Invoices | ✅ | ✅ |
| View Analytics | ✅ | ✅ |

---

## 🌐 Live Demo

🔗 **[https://inventra-sandy.vercel.app/](https://inventra-sandy.vercel.app/)**

> Demo account দিয়ে explore করুন অথবা Google দিয়ে login করুন।

---

## 👨‍💻 Developer

**Azizul** — MERN Stack Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-4F46E5?style=flat-square)](https://protfolio-ten-silk.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/azizul-dev)

---

<div align="center">

⭐ **এই প্রজেক্ট useful মনে হলে একটা Star দিন!**

*Built with ❤️ using Next.js, MongoDB & Express*

</div>