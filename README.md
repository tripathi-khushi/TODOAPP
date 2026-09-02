# 📋 Smartech Multi-Page Todo & Learning Dashboard

A high-performance, full-stack Academic Task Management and Coursework Dashboard built with a **Multi-Page Application (MPA)** architecture in **React.js (Vite)** and a production-grade **Node.js / Express / MongoDB** backend.

---

## 📑 Table of Contents
1. [Application Overview](#-application-overview)
2. [Visual Design & Aesthetic](#-visual-design--aesthetic)
3. [Multi-Page Architecture (MPA)](#-multi-page-architecture-mpa)
4. [Complete Feature Documentation](#-complete-feature-documentation)
   - [1. User Authentication & 6-Digit Email OTP Verification](#1-user-authentication--6-digit-email-otp-verification)
   - [2. Guest Mode vs. Authenticated Mode](#2-guest-mode-vs-authenticated-mode)
   - [3. Live Multi-Field Search & Floating Dropdown](#3-live-multi-field-search--floating-dropdown)
   - [4. Task CRUD & Detailed Attributes](#4-task-crud--detailed-attributes)
   - [5. Subtask Milestones & Progress Tracking](#5-subtask-milestones--progress-tracking)
   - [6. Multi-Criteria Filtering & Sorting Toolbar](#6-multi-criteria-filtering--sorting-toolbar)
   - [7. Performance & Engagement Gauges (Attendance, Homework, Rating)](#7-performance--engagement-gauges-attendance-homework-rating)
   - [8. Interactive Schedule Calendar & Agenda Timeline](#8-interactive-schedule-calendar--agenda-timeline)
   - [9. Active Projects Showcase](#9-active-projects-showcase)
   - [10. Dedicated Single Todo Detail Page (`/todo.html`)](#10-dedicated-single-todo-detail-page-todohtml)
   - [11. User Profile, Settings & Preferences](#11-user-profile-settings--preferences)
   - [12. Backend Security & Data Protection](#12-backend-security--data-protection)
   - [13. Database Architecture & Atlas DNS Resilience](#13-database-architecture--atlas-dns-resilience)
5. [REST API Reference](#-rest-api-reference)
6. [Project Directory Structure](#-project-directory-structure)
7. [Getting Started & Local Development](#-getting-started--local-development)
8. [Production Build & Deployment](#-production-build--deployment)

---

## 🌟 Application Overview

The **Smartech Dashboard** is an academic productivity suite designed for students and developers. It combines task scheduling, assignment tracking, coursework milestone management, and academic metrics into an aesthetic, responsive interface.

---

## 🎨 Visual Design & Aesthetic

The application is styled with a custom design system:
- **Palette**: Warm cream background (`#faf4f5`), soft mauve card containers (`#ebdce5`), rich plum typography and button states (`#624b5d`), and neon status accents.
- **Accents**: 
  - 🌸 **Pink / Urgent** (`#ec538c`): High-priority deadlines and attendance progress.
  - 🩵 **Cyan / Projects** (`#3fc7bb`): Project coursework and homework progress.
  - 🍯 **Amber / Rating** (`#f8ad38`): Academic rating score.
  - 🌿 **Green / Success** (`#1e8e3e`): Completed milestones.
- **Typography**: Modern typography powered by *Outfit* (headings) and *Plus Jakarta Sans* (body).
- **Responsive Layout**: Fluid grid and flexbox arrangements optimized for desktops, tablets, and mobile screens.

---

## 🏛 Multi-Page Architecture (MPA)

Unlike standard Single-Page Applications (SPAs) that fake routing through client-side JavaScript, this application follows a true **Multi-Page Application** architecture with independent HTML entry points:

| Page | HTML Entry Point | React Mount | Purpose |
| :--- | :--- | :--- | :--- |
| **Dashboard & Todos List** | [`index.html`](file:///client/index.html) | [`main.jsx`](file:///client/src/pages/main/main.jsx) / [`App.jsx`](file:///client/src/pages/main/App.jsx) | Main learning dashboard, statistics gauges, calendar, and task management. |
| **Single Task Inspector** | [`todo.html`](file:///client/todo.html) | [`todo.jsx`](file:///client/src/pages/todo/todo.jsx) / [`TodoApp.jsx`](file:///client/src/pages/todo/TodoApp.jsx) | Dedicated task detail editor, subtask progress bar, and metadata inspector (`?todo_id=<id>`). |

- **Vite Multi-Page Build**: Configured in [`vite.config.js`](file:///client/vite.config.js) via Rollup multi-input bundling (`input: { main: 'index.html', todo: 'todo.html' }`).

---

## 🚀 Complete Feature Documentation

### 1. User Authentication & 6-Digit Email OTP Verification
- **Email Verification Flow**:
  1. User fills in Name, Email, Password, Major/Degree, and Student ID.
  2. The backend generates a cryptographically secure 6-digit verification code with a 5-minute TTL.
  3. Real verification email is dispatched to the user's inbox using **Nodemailer (SMTP/TLS)**.
  4. User enters the 6-digit code in the interactive OTP digit input boxes (with auto-focus and backspace navigation).
  5. Upon confirmation, the user account is created in MongoDB with a **Bcrypt-hashed password** (single salt round), and automatic starter coursework tasks are populated.
- **Session Management**: Issues standard **JSON Web Tokens (JWT)** valid for 30 days, stored securely in client storage.
- **Password Protection**: Prevents double-hashing bugs and supports reliable login authentication via `bcrypt.compare`.

### 2. Guest Mode vs. Authenticated Mode
- **Guest Mode**: Allows anyone to browse the interface, explore features, view calendar layouts, and test UI components without creating an account.
- **Authenticated Mode**: Automatically activates database persistence, isolated user tasks, custom student profiles, and synchronized statistics.

### 3. Live Multi-Field Search & Floating Dropdown
- **Instant Search Bar**: Located in the main header bar for rapid task discovery.
- **Multi-Field Query Matching**: Matches keywords across:
  - Task Titles
  - Descriptions & Notes
  - Categories (`Academic`, `Projects`, `Personal`, `Work`, `Design`, `Other`)
  - Priorities (`Low`, `Medium`, `High`, `Urgent`)
  - Subtask Milestone Titles
  - Hashtags (e.g., `#Robotics`, `#Hardware`)
- **Interactive Floating Dropdown Preview**:
  - Displays top matching results with priority badges, categories, and due dates as you type.
  - Clicking any result opens the task editor or navigates directly to the dedicated detail view.
  - Clicking *"View all matching tasks"* or pressing <kbd>Enter</kbd> filters the entire Task Manager view.
- **Debounced Performance**: Built-in 250ms debouncer prevents unnecessary API requests while typing.

### 4. Task CRUD & Detailed Attributes
- **Create**: Modal dialog (`TodoModal`) with real-time validation for:
  - `title` (Required, string)
  - `description` (Detailed text area)
  - `category` (Academic, Projects, Personal, Work, Design, Other)
  - `priority` (Low, Medium, High, Urgent)
  - `status` (Pending, In Progress, Completed)
  - `dueDate` (Date picker)
  - `time` (Time selector, e.g., `19:30`)
  - `subtasks` (List of checkable steps)
  - `tags` (Comma-separated tags)
- **Read**: Dynamic responsive list view with visual due chips (`Today`, `Overdue`), category pills, and priority indicators.
- **Update**: Full update via edit modal or partial status toggle directly from the task checkbox.
- **Delete**: Task deletion with confirmation dialog and database removal.

### 5. Subtask Milestones & Progress Tracking
- **Multi-Step Tasks**: Tasks can have multiple granular subtasks (e.g., *"Derive matrices"*, *"Tune PID gain"*, *"Submit simulation graphs"*).
- **Interactive Checklist**: Toggle individual subtasks complete/incomplete from either the main dashboard or the dedicated task inspector page.
- **Visual Progress Bar**: Displays an animated progress bar computing exact completion percentage (e.g., `2/4 subtasks completed • 50%`).

### 6. Multi-Criteria Filtering & Sorting Toolbar
- **Status Tabs**: Instant tab switching between `All`, `Pending`, `In Progress`, and `Completed` with live numeric counter badges.
- **Category Filter Dropdown**: Filter tasks by `Academic`, `Projects`, `Personal`, `Work`, or `Design`.
- **Priority Filter Dropdown**: Filter tasks by `Low`, `Medium`, `High`, or `Urgent`.
- **Sorting Options**:
  - `Newest First` (`createdAt` descending)
  - `Oldest First` (`createdAt` ascending)
  - `Due Date (Earliest)` (`dueDate` ascending)
  - `Due Date (Latest)` (`dueDate` descending)
  - `Title (A-Z)` (`title` alphabetical)

### 7. Performance & Engagement Gauges (Attendance, Homework, Rating)
- **Attendance Meter (Pink)**: Computes student engagement and task completion consistency (from a 50% baseline up to 100%).
- **Homework Meter (Cyan)**: Dynamically calculates the completion rate of academic assignments (`category: 'Academic'`).
- **Rating Score (Amber)**: Aggregated performance score reflecting overall progress across all modules.
- **Animated SVG Circular Meters**: Smooth SVG stroke-dasharray animations with percentage readouts and completed task counters.

### 8. Interactive Schedule Calendar & Agenda Timeline
- **Monthly Interactive Calendar**: Full calendar view with previous/next month navigation, current day highlighting, and selectable dates.
- **Synchronized Agenda**: Pulls upcoming due tasks directly from MongoDB and organizes them in a timeline with time badges, category tags, and direct view links.

### 9. Active Projects Showcase
- **Projects Card**: Visual grid displaying active engineering and coursework builds (*"Homework 15: Autonomous Rover"*, *"Homework 10: Logic Gate Breadboard"*).
- **One-Click Filter**: Clicking any project immediately filters the Task Manager to show related project tasks.

### 10. Dedicated Single Todo Detail Page (`/todo.html`)
- **URL Parameter Extraction**: Automatically loads task data using `window.location.search` query parameters (`?todo_id=6634...`).
- **Interactive Status Switcher**: Segmented buttons to transition task state between `Pending`, `In Progress`, and `Completed`.
- **Full Editor & Subtask Manager**: Edit title, notes, deadline, tags, and add/remove subtask items in real-time.
- **System Metadata**: Displays creation timestamps, last update times, and unique MongoDB ObjectId.

### 11. User Profile, Settings & Preferences
- **Student Profile Management**: Update student name, email, major/degree track, and student ID directly in MongoDB.
- **Notification Toggles**: Preferences for assignment due date reminders, lesson alerts, and daily morning digests.
- **Session Health Box**: Live indicator displaying active user information and database connection state.

### 12. Backend Security & Data Protection
- **Helmet**: Secures HTTP headers against common web vulnerabilities.
- **Data Sanitization (`express-mongo-sanitize`)**: Strips prohibited `$` and `.` operators to prevent NoSQL query injection attacks.
- **XSS Sanitization Middleware**: Cleans user inputs to prevent malicious script injection.
- **Rate Limiting (`express-rate-limit`)**:
  - General API: 300 requests / 15 minutes.
  - OTP Email Dispatch: Max 3 emails / minute (prevents inbox spamming).
  - Auth/Login Limiter: 30 attempts / minute with `skipSuccessfulRequests: true`.
- **Payload Limits**: 1MB JSON and URL-encoded body limits to mitigate denial-of-service attempts.

### 13. Database Architecture & Atlas DNS Resilience
- **Cloud MongoDB Atlas & Local MongoDB**: Fully supports cloud MongoDB connection strings (`mongodb+srv://...`).
- **Automated Public DNS Resolvers**: Integrated Node.js DNS configuration (`8.8.8.8`, `1.1.1.1`) resolving SRV records reliably across Windows environments and restricted ISPs.
- **Embedded In-Memory Fallback**: Seamlessly falls back to embedded `mongodb-memory-server` if cloud or local MongoDB instances are unreachable.

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-signup-otp` | Validate details and email 6-digit OTP code | No |
| `POST` | `/api/auth/verify-signup-otp` | Verify OTP code and activate user account | No |
| `POST` | `/api/auth/resend-otp` | Resend fresh OTP verification code | No |
| `POST` | `/api/auth/login` | Authenticate user with password and return JWT | No |
| `GET` | `/api/auth/me` | Fetch active user session information | Optional (Bearer JWT) |
| `PUT` | `/api/auth/profile` | Update profile information in database | Yes (Bearer JWT) |

### Todo & Task Endpoints (`/api/todos`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Fetch isolated tasks (supports `search`, `status`, `category`, `priority`, `sortBy`, `order`) | Yes |
| `GET` | `/api/todos/stats` | Calculate metrics (Attendance %, Homework %, Rating score, Upcoming items) | Yes |
| `GET` | `/api/todos/:id` | Fetch single task by MongoDB ObjectId | Yes |
| `POST` | `/api/todos` | Create a new task | Yes |
| `PUT` | `/api/todos/:id` | Full update of existing task | Yes |
| `PATCH` | `/api/todos/:id` | Partial update (toggle `isCompleted`, update status) | Yes |
| `DELETE` | `/api/todos/:id` | Delete task by MongoDB ObjectId | Yes |

### Health Endpoint
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server status, uptime, and active security middleware | No |

---

## 🛠 Project Directory Structure

```
ToDoListApp/
├── package.json               # Root npm workspace scripts
├── nodemon.json               # Backend server watch config
├── .gitignore                 # Protected environment & node_modules ignore rules
├── README.md                  # Comprehensive documentation
│
├── server/                    # Express + MongoDB Backend API
│   ├── .env                   # Environment secrets (PORT, MONGODB_URI, EMAIL_USER, EMAIL_PASS)
│   ├── .env.example           # Environment variable template
│   ├── server.js              # Server entry point, security headers & routing
│   ├── package.json           # Backend dependencies (express, mongoose, bcryptjs, etc.)
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection & DNS resolvers
│   ├── models/
│   │   ├── User.js            # User account schema with password hashing
│   │   ├── Otp.js             # 6-digit OTP verification schema (5m TTL)
│   │   └── Todo.js            # Todo task & subtask milestone schema
│   ├── controllers/
│   │   ├── authController.js  # OTP dispatch, verification & authentication logic
│   │   └── todoController.js  # Task CRUD, statistics & search controllers
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication & session guard
│   │   └── securityMiddleware.js # Rate limiters, NoSQL sanitization & XSS guard
│   ├── routes/
│   │   ├── authRoutes.js      # Auth API endpoints
│   │   └── todoRoutes.js      # Task API endpoints
│   └── seeds/
│       └── starterTasks.js    # Automatic coursework seed tasks for new users
│
└── client/                    # Vite + React Multi-Page Application (MPA)
    ├── package.json           # Frontend dependencies (react, lucide-react, vite)
    ├── vite.config.js         # Multi-page Rollup input configuration & API proxy
    ├── index.html             # Page 1 Entry HTML: Learning Dashboard & Tasks
    ├── todo.html              # Page 2 Entry HTML: Dedicated Single Task Inspector
    └── src/
        ├── styles/
        │   ├── theme.css      # Design tokens (colors, gradients, shadows, radii)
        │   ├── dashboard.css  # Dashboard & task manager styles
        │   └── todoDetail.css # Dedicated single task page styles
        ├── services/
        │   └── api.js         # Unified REST API communication layer
        ├── components/
        │   ├── Header.jsx     # Top greeting, functional search bar & user menu
        │   ├── Sidebar.jsx    # Left navigation menu & user profile widget
        │   ├── StatGauge.jsx  # SVG circular progress gauges (Attendance/Homework/Rating)
        │   ├── CalendarCard.jsx # Monthly calendar schedule widget
        │   ├── ProjectsCard.jsx # Active project thumbnails
        │   ├── FilterBar.jsx  # Filter toolbar (Status, Category, Priority, Sorting)
        │   ├── TodoCard.jsx   # Task card with interactive completion toggle
        │   ├── TodoModal.jsx  # Create/Edit task modal dialog
        │   ├── AuthModal.jsx  # Sign-in & 6-digit OTP verification modal
        │   ├── ScheduleView.jsx # Timetable schedule agenda view
        │   ├── SettingsView.jsx # Profile management & notification preferences
        │   └── Toast.jsx      # Animated action feedback toast
        └── pages/
            ├── main/
            │   ├── main.jsx   # Page 1 bootstrap
            │   └── App.jsx    # Main Dashboard & Task Manager app
            └── todo/
                ├── todo.jsx   # Page 2 bootstrap
                └── TodoApp.jsx# Single Task Inspector app
```

---

## ⚡ Getting Started & Local Development

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### 1. Clone & Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(Installs dependencies across the root, `server/`, and `client/` directories.)*

### 2. Configure Environment Variables
Verify or create [`server/.env`](file:///server/.env):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=smartech
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
JWT_SECRET=your_jwt_secret_key_2026
```

### 3. Start Development Server
Run the concurrent dev script from the root directory:
```bash
npm run dev
```

- **Frontend (Vite MPA)**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API (Express)**: [http://localhost:5000/](http://localhost:5000/)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📦 Production Build & Deployment

To generate the optimized production bundle for both HTML entry points:
```bash
npm run build
```

The production assets will be built into `client/dist/` (`index.html`, `todo.html`, and optimized CSS/JS chunks), which are served statically by the Express backend when running `npm start`.
