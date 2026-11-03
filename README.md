# 💇 MET75 Salon Management System

A full-stack, enterprise-grade salon management and appointment reservation platform. Features client haircut tracking, automated 30-day reminder cycles, role-based authentication, a comprehensive hairstyle lookbook with multi-angle previews and full-screen lightbox, master stylist profiles, complete service rate cards (Cutting, Shaving / Saving, Massages, Face Care & Combos), and a complete appointment booking and admin acceptance system.

---

## 🌟 Highlights & Key Features

### 1. 📅 User Appointment Booking & Admin Acceptance Flow
- **Client Appointment Booking ([`AppointmentModal.jsx`](file:///c:/Users/nites_6fccbfp/Desktop/met75/frontend/src/components/AppointmentModal.jsx))**:
  - Accessible from the Home page, Hair Designs lookbook, Amount & Pricing page, or User Dashboard.
  - Choose service/style with live price and photo preview.
  - Select preferred master barber or "Any Available Master Barber".
  - Interactive date picker (with past date protection) and time slot grid (`09:30 AM`, `10:30 AM`, `11:30 AM`, `01:00 PM`, `02:15 PM`, etc.).
  - Add contact phone number and custom styling instructions.
  - Initial status: `⏳ Pending Acceptance`.
- **Admin One-Click Acceptance ([`AdminDashboard.jsx`](file:///c:/Users/nites_6fccbfp/Desktop/met75/frontend/src/pages/AdminDashboard.jsx))**:
  - Dedicated **Appointments** management tab with real-time pending notification badges.
  - One-click **`✓ Accept Appointment`** action:
    - Status updates immediately to **`✅ Accepted & Confirmed`**.
    - Dispatches an automated HTML confirmation email to the client.
    - Synchronizes the customer's last haircut date and 30-day reminder schedule.
  - Decline requests with custom salon note, mark completed when client finishes, or delete appointment records.
- **Client Schedule & Tracking ([`UserDashboard.jsx`](file:///c:/Users/nites_6fccbfp/Desktop/met75/frontend/src/pages/UserDashboard.jsx))**:
  - Live status pills (`Pending Acceptance`, `Accepted & Confirmed`, `Completed`, `Declined`, `Cancelled`).
  - Self-cancel option for clients while request is pending.

---

### 2. 💰 Salon Amount & Rate Card Menu (`/pricing` & `/amount`)
- **Transparent Pricing for All Services**:
  - **✂️ Hair Cutting**: Classic Cut (₹150), Skin Fade / Taper (₹250), Advanced Scissor Styling (₹300), Kids Cut (₹120), Hair Wash (₹80).
  - **🪒 Shaving & Beard Grooming ("Saving")**: Clean Razor Shave (₹100), Royal Hot-Towel Shave with Balm (₹180), Beard Trim & Razor Line-Up (₹120), Luxury Argan Beard Spa (₹220), Mustache Styling (₹50).
  - **💆‍♂️ Head Massage & Hair Spa**: Ayurvedic Almond / Navratna Champi (₹150), Mint Cool Stress Relief (₹180), Deep Conditioning Hair Spa (₹450), Scalp Anti-Dandruff Treatment (₹350).
  - **✨ Face Care, D-Tan & Cleanup**: O3+ Sun Removal D-Tan Pack (₹250), Charcoal Deep Pore Cleanup (₹350), Gold Radiance Bleach (₹300), Herbal Papaya Fruit Facial (₹550).
  - **🎨 Hair & Beard Color**: Natural Black / Dark Brown (₹250), Beard Gray Blending (₹150), Ammonia-Free Herbal Dye (₹350).
  - **🎁 Super Saver Combos**:
    - *Gentleman's Daily*: Haircut + Clean Shave + Hair Wash = **₹280** *(Save ₹50)*
    - *Royal Grooming*: Fade Cut + Hot Towel Shave + Head Massage = **₹499** *(Save ₹131)*
    - *Festive Makeover*: Haircut + Beard Shape + D-Tan Pack + Massage = **₹799** *(Save ₹251)*
- **Interactive Bill Estimate Calculator**:
  - Add services to a floating Estimate Tray to calculate total amount (`₹`), total duration, and savings.
  - One-click booking with selected services pre-filled.
- **Admin Rate Card Management**:
  - Admin can update amounts, add new services/combos, edit durations and descriptions, and delete services from the Admin Dashboard.

---

### 3. 💈 Haircut Styles & Designs Lookbook (`/hair-designs`)
- **Multi-Angle Profile Pictures (2–3 Photos per Cut)**:
  - Each haircut showcases 2–3 high-resolution angle photos (Angle 1: Front / Main, Angle 2: Side / Fade, Angle 3: Back / Texture).
  - Interactive angle thumbnail preview on every haircut card and detail modal.
- **Full-Screen Lightbox Viewer**:
  - Clicking any haircut image opens an immersive, backdrop-blurred full-screen lightbox (`z-50`).
  - Next/Previous arrow controls, clickable thumbnail navigation rail, photo counter (`Angle 1 of 3`), and keyboard controls (`Esc`, `ArrowLeft`, `ArrowRight`).
- **Barber Guide & Profile Details**:
  - Ideal face shape, recommended styling products (clay, pomade, sea salt spray), hair texture suitability, and assigned master barber.
- **Admin Haircut CRUD**:
  - Add, edit, and delete haircut styles with dedicated inputs and live previews for all 3 angle photo URLs.

---

### 4. ✂️ Master Stylists & Barbers Directory
- Profile showcase with specialty, experience years, bio, avatar, and contact info.
- Full Admin CRUD: Add new masters, edit existing credentials, and remove inactive barbers.
- Dynamic selection of master barbers in lookbook styles and appointment booking.

---

### 5. ⏰ Automated 30-Day Reminder Engine & Email System
- **Daily Cron Job**: Runs every morning (`09:00 AM IST`) via `node-cron` to detect clients due for their next haircut (`nextReminderDate <= now`).
- **Nodemailer SMTP Integration**: Beautiful HTML email templates for reminders, password reset OTPs, appointment requests, and acceptance confirmations.
- **Admin On-Demand Email Controls**:
  - 1-Click quick reminder dispatch.
  - Custom email modal composer for personalized messages.
  - Bulk reminder dispatch for all overdue clients.

---

### 6. 🔐 Secure Authentication & Password Recovery
- Stateless JWT authentication and bcrypt password hashing (12 salt rounds).
- Role-based route protection (`admin` vs. `user`).
- Secure forgot password recovery using 6-digit OTP codes expiring in 15 minutes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Pure Tailwind CSS (v4), React Router DOM, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **Email & Cron** | Nodemailer (Gmail SMTP), Node-Cron Scheduler |

---

## 📡 API Reference

### Public Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/services` | Retrieve all salon services, amounts & combos grouped by category |
| `GET` | `/api/masters` | Retrieve all salon master barbers & stylists |
| `GET` | `/api/hairstyles` | Retrieve lookbook haircut styles with 2–3 angle images |

### Authentication (`/api/auth`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register customer account |
| `POST` | `/api/auth/login` | Login customer or admin |
| `GET` | `/api/auth/me` | Get current authenticated user profile (`Bearer <token>`) |
| `POST` | `/api/auth/forgot-password` | Request 6-digit OTP password reset code |
| `POST` | `/api/auth/reset-password` | Verify code and reset password |

### Client Appointments (`/api/appointments`) *(Requires User Token)*
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/appointments` | Submit new appointment request (initial: `pending`) |
| `GET` | `/api/appointments/my` | View logged-in customer's appointment requests & status |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel a pending/accepted appointment request |

### Admin Endpoints (`/api/admin`) *(Requires Admin Token)*
| Method | Route | Description |
|---|---|---|
| **Customers** | | |
| `GET` | `/api/admin/users` | List all registered customers |
| `DELETE` | `/api/admin/users/:id` | Delete customer account |
| `GET` | `/api/admin/reminders` | List customers with overdue haircuts |
| `PATCH` | `/api/admin/users/:id/cutting-date` | Update customer's haircut date & calculate next reminder |
| `POST` | `/api/admin/users/:id/send-email` | Send manual/custom reminder email |
| `POST` | `/api/admin/send-due-reminders` | Bulk dispatch reminder emails to all due clients |
| **Appointments** | | |
| `GET` | `/api/admin/appointments` | Get all appointment requests with stats (`total`, `pending`, etc.) |
| `PATCH` | `/api/admin/appointments/:id/status` | **Accept**, decline, or complete an appointment |
| `DELETE` | `/api/admin/appointments/:id` | Delete appointment record |
| **Rate Card & Services** | | |
| `POST` | `/api/admin/services` | Add new service & price amount |
| `PATCH` | `/api/admin/services/:id` | Update service details or pricing amount |
| `DELETE` | `/api/admin/services/:id` | Remove service from rate card |
| **Hairstyles Lookbook** | | |
| `POST` | `/api/admin/hairstyles` | Add cutting style with 2–3 profile pictures |
| `PATCH` | `/api/admin/hairstyles/:id` | Update cutting style details and image angles |
| `DELETE` | `/api/admin/hairstyles/:id` | Delete cutting style |
| **Masters / Barbers** | | |
| `POST` | `/api/admin/masters` | Add new master barber profile |
| `PATCH` | `/api/admin/masters/:id` | Update master profile |
| `DELETE` | `/api/admin/masters/:id` | Delete master profile |

---

## 🖥️ Frontend Navigation & Routes

| Route | Page | Access | Description |
|---|---|---|---|
| `/` | **Home** | Public | Landing page with dynamic navbar, hero reservation button, service highlights, and 30-day workflow |
| `/hair-designs` | **Hair Designs** | Public | Interactive lookbook, 2–3 angle photo thumbnails, full-screen lightbox, and one-click "Book Cut" |
| `/pricing`, `/amount` | **Amount & Pricing** | Public | Rate card menu for cutting, saving, massage, face care, combos, and live bill estimate calculator |
| `/about` | **About** | Public | Salon heritage, master barbers team, studio hours, and philosophy |
| `/login` | **Login** | Public | Account authentication with forgot password link |
| `/register` | **Register** | Public | Customer account registration |
| `/forgot-password` | **Forgot Password** | Public | Request 6-digit OTP email |
| `/reset-password` | **Reset Password** | Public | Set new password using verified OTP code |
| `/dashboard` | **User Dashboard** | `user` | Personal schedule, last haircut date, next due date, and appointment booking tracker |
| `/admin` | **Admin Dashboard** | `admin` | Full management console: Customers, Masters, Hairstyles, Appointments, and Rate Card |

---

## ⚙️ Environment Variables

Create `backend/.env` with the following configuration:

```env
PORT=5000
CLIENT_URL=http://localhost:5174
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your_salon_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
TIMEZONE=Asia/Kolkata
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repo-url>
cd met75

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start Backend Server
```bash
cd backend
node server.js
# Backend runs on http://localhost:5000
```

### 3. Start Frontend Client
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5174
```

### 4. Build for Production
```bash
npm run build --prefix frontend
```
