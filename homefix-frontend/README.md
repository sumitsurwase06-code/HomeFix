# HomeFix — Major BTech Full-Stack Project (Frontend)

> **"Reliable Home Services, Right When You Need Them."**

HomeFix is a modern centralized household repair and maintenance services marketplace that connects homeowners with verified local technicians across trades such as plumbing, electrical, carpentry, appliance repair, and waterproofing.

---

## 🎯 Architecture & Spring Boot REST API Readiness

This project represents the **Frontend Subsystem** of the HomeFix Major Project.
It is architected using **React.js + Vite** with modular services to cleanly connect to an enterprise **Java Spring Boot REST API** and **MySQL** database.

### API Layer Structure (`src/services/api.js`)
- Axios client configured with `import.meta.env.VITE_API_BASE_URL` (configured via `.env.example`).
- Bearer token interceptor ready for Spring Security JWT authentication.
- Separated modular service modules:
  - `authApi`: Sign in, registration, OTP verification.
  - `customerApi`: Profile management, saved delivery addresses.
  - `technicianApi`: Directory listing, schedule availability.
  - `bookingApi`: Multi-step booking lifecycle, status progression.
  - `adminApi`: Partner verification approvals/rejections, KPI analytics.
  - `paymentApi`: Simulated escrow checkout & itemized payment receipts.
  - `reviewApi`: Moderated verified feedback.

---

## 💻 Tech Stack
- **Library / Core:** React.js 19
- **Build Tool:** Vite
- **Language:** Modern JavaScript (ES6+ / JSX)
- **Styling:** Vanilla CSS Design System with CSS Custom Properties (`:root` variables)
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** Lucide React

---

## 📁 Project Directory Structure

```text
homefix-frontend/
├── public/
│   └── assets/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx & Button.css
│   │   │   ├── Card.jsx & Card.css
│   │   │   ├── Input.jsx & Input.css
│   │   │   ├── Modal.jsx & Modal.css
│   │   │   ├── Badge.jsx & Badge.css
│   │   │   ├── Loading.jsx & Loading.css
│   │   │   ├── EmptyState.jsx & EmptyState.css
│   │   │   └── ErrorState.jsx & ErrorState.css
│   │   ├── navbar/
│   │   │   ├── Navbar.jsx & Navbar.css
│   │   ├── footer/
│   │   │   ├── Footer.jsx & Footer.css
│   │   ├── service/
│   │   │   ├── ServiceCard.jsx & ServiceCard.css
│   │   ├── technician/
│   │   │   ├── TechnicianCard.jsx & TechnicianCard.css
│   │   ├── booking/
│   │   │   ├── BookingCard.jsx & BookingCard.css
│   │   └── dashboard/
│   │       ├── StatCard.jsx & StatCard.css
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   ├── CustomerLayout.jsx
│   │   ├── TechnicianLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── DashboardLayout.css
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx & Home.css
│   │   │   ├── Services.jsx
│   │   │   ├── Technicians.jsx
│   │   │   ├── TechnicianDetails.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx & Auth.css
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── OTPVerification.jsx
│   │   ├── customer/
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── BookService.jsx
│   │   │   ├── TechnicianSearch.jsx
│   │   │   ├── BookingDetails.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Addresses.jsx
│   │   │   ├── CustomerProfile.jsx
│   │   │   └── WriteReview.jsx
│   │   ├── technician/
│   │   │   ├── TechnicianDashboard.jsx
│   │   │   ├── BookingRequests.jsx
│   │   │   ├── TechnicianBookings.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Availability.jsx
│   │   │   ├── Earnings.jsx
│   │   │   ├── Reviews.jsx
│   │   │   └── TechnicianProfile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageCustomers.jsx
│   │       ├── ManageTechnicians.jsx
│   │       ├── TechnicianVerification.jsx
│   │       ├── ManageBookings.jsx
│   │       ├── AdminBookingDetails.jsx
│   │       ├── Revenue.jsx
│   │       ├── ReviewsManagement.jsx
│   │       ├── ServiceCategories.jsx
│   │       └── AuditLogs.jsx
│   ├── data/
│   │   ├── services.js
│   │   ├── technicians.js
│   │   ├── bookings.js
│   │   └── demoUsers.js
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Install Dependencies
```bash
cd homefix-frontend
npm install
```

### 2. Start the Vite Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`.

---

## 🔑 Demo Personas for Quick Evaluation & Viva Testing

On the **Login page** (`/login`) and in the **Dashboard topbar**, you can switch between demo user roles with a single click:

| Role | Email | Password | Primary Features |
|---|---|---|---|
| **Customer** | `customer@homefix.demo` | `demo1234` | 7-step booking wizard, live service tracking, saved addresses, reviews |
| **Technician** | `technician@homefix.demo` | `demo1234` | Dispatch requests, accept/reject, enter labor/material charges, weekly availability |
| **Super Admin** | `admin@homefix.demo` | `demo1234` | Partner verification approval/rejection modal, 10% platform commission accounting, audit logs |

---

## 🎓 Academic Notice
All customer reviews, numerical revenue figures, and technician profiles in this frontend prototype are simulated demo records specifically generated for university evaluation and capstone viva presentation.
