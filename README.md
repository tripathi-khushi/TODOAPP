# Smartech Multi-Page Todo & Learning Dashboard

A high-performance full-stack Todo and Academic Task Management application built with a **Multi-Page Application (MPA)** architecture in **React.js** and an **Express.js / MongoDB** backend.

---

## 🎨 Visual & Design Architecture
- **Modern Pastel Theme**: Warm neutral canvas (`#faf4f5`), soft mauve tints (`#ebdce5`), rich plum accents (`#3d2839`), and neon progress meters (`#ec538c`, `#3fc7bb`, `#f8ad38`).
- **Interactive Multi-Page Workflow**: Independent HTML entry points for the Dashboard (`index.html`) and dedicated Task Inspector (`todo.html?todo_id=...`).
- **Live Search & Dropdown Preview**: Fast multi-field query matching with instant floating dropdown results and debounced filtering.
- **Academic Performance Gauges**: Circular SVG meters tracking Attendance, Homework Completion, and Overall Rating.
- **Interactive Schedule & Calendar**: Dynamic monthly calendar synchronized with task due dates.
- **Secure Authentication**: OTP email verification, hashed passwords with bcrypt, and JWT user isolation.

---

## 🏛 Architecture: Multi-Page Application (MPA)

- **Entry Points**:
  1. `index.html` → Main Task Management & Dashboard View.
  2. `todo.html` → Detailed Single Task Inspector (`?todo_id=<id>`).
- **Vite Multi-Page Build**: Configured with Rollup inputs (`input: { main: 'index.html', todo: 'todo.html' }`).

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Generate and send 6-digit OTP verification code |
| `POST` | `/api/auth/verify-otp` | Verify OTP code and complete user registration |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `PATCH` | `/api/auth/profile` | Update user profile and preferences |
| `GET` | `/api/todos` | Fetch isolated tasks (supports search, filter, sort) |
| `GET` | `/api/todos/stats` | Aggregated dashboard metrics & completion rates |
| `GET` | `/api/todos/:id` | Fetch single task details by ID |
| `POST` | `/api/todos` | Create a new task |
| `PUT` | `/api/todos/:id` | Full task update |
| `PATCH` | `/api/todos/:id` | Partial update (status, completion, subtasks) |
| `DELETE` | `/api/todos/:id` | Delete task by ID |
| `GET` | `/api/health` | Server uptime & security status |

---

## 🛠 Project Structure

```
ToDoListApp/
├── package.json               # Root scripts (dev, build, server, client)
├── nodemon.json               # Server watch configuration
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
│
├── server/                    # Express + MongoDB Backend
│   ├── .env.example           # Environment template
│   ├── package.json           # Backend dependencies
│   ├── server.js              # Server entry point & middleware
│   ├── config/
│   │   └── db.js              # MongoDB Atlas / In-memory connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Otp.js             # OTP verification model
│   │   └── Todo.js            # Todo task model
│   ├── controllers/
│   │   ├── authController.js  # Auth & OTP handlers
│   │   └── todoController.js  # Task CRUD & statistics handlers
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication guard
│   │   └── securityMiddleware.js # Rate limiting & sanitization
│   └── routes/
│       ├── authRoutes.js      # Auth API routes
│       └── todoRoutes.js      # Todo API routes
│
└── client/                    # Vite + React Frontend (MPA)
    ├── package.json           # Frontend dependencies
    ├── vite.config.js         # Multi-page Vite configuration
    ├── index.html             # Dashboard entry HTML
    ├── todo.html              # Single task entry HTML
    └── src/
        ├── styles/
        │   ├── theme.css      # Design tokens
        │   ├── dashboard.css  # Dashboard styles
        │   └── todoDetail.css # Task detail styles
        ├── services/
        │   └── api.js         # Unified REST API service
        ├── components/
        │   ├── Header.jsx     # Functional search & user controls
        │   ├── Sidebar.jsx    # Navigation sidebar
        │   ├── StatGauge.jsx  # Performance gauges
        │   ├── CalendarCard.jsx # Schedule calendar widget
        │   ├── ProjectsCard.jsx # Projects showcase
        │   ├── FilterBar.jsx  # Task filter & sorting toolbar
        │   ├── TodoCard.jsx   # Interactive task item card
        │   ├── TodoModal.jsx  # Task creation/editing modal
        │   ├── AuthModal.jsx  # Sign-in / OTP registration modal
        │   ├── ScheduleView.jsx # Timetable schedule view
        │   ├── SettingsView.jsx # Student settings & preferences
        │   └── Toast.jsx      # Feedback notification toasts
        └── pages/
            ├── main/          # Dashboard React app
            └── todo/          # Single task React app
```

---

## ⚡ Getting Started Locally

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Development Server
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:5000/](http://localhost:5000/)

### 3. Production Build
```bash
npm run build
```
