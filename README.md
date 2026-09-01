# Smartech Pastel Multi-Page Todo & Learning Dashboard

A modern, high-fidelity full-stack Todo & Learning Dashboard application inspired by the **Smartech** educational dashboard UI reference. Built with a **Multi-Page Application (MPA)** architecture in React.js and a robust **Node.js / Express / MongoDB** backend.

---

## 📸 Key Visual & Design Highlights
- **Curated Pastel Palette**: Warm beige/cream canvas (`#faf4f5`), soft lilac/mauve card tints (`#ebdce5`), rich plum accents (`#3d2839`), and vibrant neon progress gauges (`#ec538c`, `#3fc7bb`, `#f8ad38`).
- **Smartech Navigation Sidebar**: Branded header with active indicator, avatar profile card ("Sophia Tompson"), and intuitive multi-page navigation links.
- **Reference-Accurate Dashboard Widgets**:
  - **Linked Teachers Card**: Displays connected mentors (Olivia Miller, Liam Garcia, Jackson Lopez) with direct chat triggers.
  - **Upcoming Events Card**: Highlights major events (e.g. Robot Fest, Minecraft Education Webinar) with badges and timestamps.
  - **Interactive Schedule & Calendar**: Monthly calendar with previous/next navigation and pill badges for upcoming lessons.
  - **Projects Showcase**: Visual cards for active builds ("Homework 15: Autonomous Rover", "Homework 10: Logic Breadboard").
  - **Circular Progress Gauges**: Triple SVG circular meters tracking Attendance (60%), Homework (Dynamic/Calc), and Rating (78%+).

---

## 🏛 Architecture: Multi-Page Application (MPA)

Unlike standard Single Page Applications (SPAs), this project adheres to a strict **Multi-Page Application (MPA)** architecture:
- **No React Router SPA routing**: Standard HTML-style multi-page navigation is used via standard `<a>` tags and `window.location`.
- **Distinct HTML Entry Points**:
  1. `index.html` → Bundled with `main.jsx` & `App.jsx` for **Page 1: Todos List & Dashboard**.
  2. `todo.html` → Bundled with `todo.jsx` & `TodoApp.jsx` for **Page 2: Dedicated Single Todo Page**.
- **Vite Multi-Page Build**: Vite is configured with Rollup multi-page inputs (`input: { main: 'index.html', todo: 'todo.html' }`) allowing each page to load independently with its own document lifecycle.

---

## 🚀 Features Breakdown

### 1. Frontend Features (React.js MPA)

#### 📄 Page 1: Todos List & Learning Dashboard (`/index.html`)
- **Dashboard Banner & Header**:
  - Greeting: `"HELLO, SOPHIA!"`
  - Real-time search bar with debounce and clear button.
  - Action buttons for Quick Add Task (`+ New Task`) and Demo Data Reset (`✨ Seed Demo Data`).
  - Notification popover showing recent task activity and lesson reminders.
- **Dynamic Task Filtering & Sorting**:
  - **Status Tabs**: Instant filtering by `All`, `Pending`, `In Progress`, and `Completed` with live task count badges.
  - **Category Filter**: Filter by `Academic`, `Projects`, `Personal`, `Work`, `Design`, etc.
  - **Priority Filter**: Filter by `Low`, `Medium`, `High`, `Urgent`.
  - **Sorting**: Sort by Newest First, Oldest First, Due Date (Earliest/Latest), or Title (A-Z).
- **Interactive Task Cards (`TodoCard`)**:
  - Checkbox toggle for immediate completion status updates with optimistic UI.
  - Color-coded priority badges and category tags.
  - Subtask completion progress chip (e.g., `2/4 subtasks`).
  - Due date indicator with visual tags for `Today` or `Overdue`.
  - Quick action buttons to Edit, Delete, and **View Full Details (navigates to `/todo.html?todo_id=...`)**.
- **Create / Edit Task Modal (`TodoModal`)**:
  - Modal dialog with validation for Title, Description, Category, Priority, Due Date, Scheduled Time, Subtasks, and Tags.
  - Interactive subtask creator inside the modal.
- **Real-Time Toast Feedback**: Animated toasts for success, error, and status updates.

#### 📄 Page 2: Dedicated Single Todo Page (`/todo.html?todo_id=...`)
- **URL Query Parameter Extraction**:
  - Automatically parses the URL query parameter `?todo_id=<id>` via `URLSearchParams`.
  - Fetches the specific task from the backend REST API on page mount.
  - Graceful fallback and error messaging if `todo_id` is missing or invalid, with a "Return to Dashboard" action.
- **Native Multi-Page Navigation**:
  - `<a href="/index.html" className="btn-back-link">` standard HTML back link.
  - Interactive breadcrumbs: `Dashboard / Todos / [Task Title]`.
- **Live Status Segment Switcher**:
  - Segmented pill control to toggle between `Pending`, `In Progress`, and `Completed` with automatic API sync.
- **Full Inline Task Inspector & Editor**:
  - Edit task title, detailed description/notes, category, priority, due date, scheduled time, and tags.
- **Interactive Subtask Manager**:
  - Real-time check/uncheck subtask milestone boxes.
  - Dynamic gradient progress bar (calculates exact % of subtasks completed).
  - Add new subtasks inline (via Enter key or button).
  - Delete individual subtask milestones.
- **System Metadata & Actions**:
  - Displays MongoDB ObjectId, creation timestamp, and last modified timestamp.
  - `Save All Changes` button to persist updates.
  - `Delete Task` button with confirmation prompt, automatically redirecting back to `/index.html`.

---

### 2. Backend Features (Node.js + Express.js + Mongoose)

#### 🗄️ Database & Schema Design (`Todo.js`)
- **Mongoose Todo Schema**:
  - `title`: String (Required, trimmed, max 200 chars).
  - `description`: String (Trimmed notes).
  - `category`: Enum (`['Academic', 'Personal', 'Work', 'Projects', 'Design', 'Other']`).
  - `priority`: Enum (`['Low', 'Medium', 'High', 'Urgent']`).
  - `status`: Enum (`['Pending', 'In Progress', 'Completed']`).
  - `isCompleted`: Boolean (Kept in sync with status via Mongoose pre-save hooks).
  - `dueDate`: Date (Task deadline).
  - `time`: String (e.g., `'19:30'`, `'16:00'`).
  - `subtasks`: Array of sub-documents (`[{ title: String, isCompleted: Boolean, createdAt: Date }]`).
  - `tags`: Array of Strings (e.g., `['Robotics', 'Hardware']`).
  - `timestamps`: Automatic `createdAt` and `updatedAt`.
  - `subtaskProgress`: Virtual property calculating percentage completion.
- **Seamless Database Connection with In-Memory Fallback (`db.js`)**:
  - Connects to standalone MongoDB via `MONGODB_URI` (default: `mongodb://127.0.0.1:27017/smartech_todo`).
  - If standalone MongoDB is unavailable, automatically initiates an embedded `mongodb-memory-server` instance. This ensures the app works out-of-the-box in any development or evaluation environment without external dependencies!

#### 📡 RESTful API Endpoints

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Fetch all todos | `search`, `status`, `category`, `priority`, `sortBy`, `order` |
| `GET` | `/api/todos/stats` | Fetch aggregated dashboard metrics | Attendance %, Homework %, Rating score, Upcoming tasks |
| `GET` | `/api/todos/:id` | Fetch a single todo by MongoDB ID | Parameter: `:id` |
| `POST` | `/api/todos` | Create a new todo | Body: `{ title, description, category, priority, status, dueDate, time, subtasks, tags }` |
| `PUT` | `/api/todos/:id` | Full update of an existing todo | Body: Full todo object |
| `PATCH` | `/api/todos/:id` | Partial update (status, subtasks) | Body: `{ isCompleted, status, subtaskId, subtaskCompleted, newSubtask }` |
| `DELETE` | `/api/todos/:id` | Delete a todo by MongoDB ID | Parameter: `:id` |
| `POST` | `/api/todos/seed` | Reset & re-seed reference demo data | None |
| `GET` | `/api/health` | Server uptime & health check | None |

---

## 🛠 Project Structure

```
ToDoListApp/
├── .git/                      # Initialized Git repository
├── package.json               # Root scripts (dev, install, server, client)
├── .gitignore                 # Standard Node, React, and build ignore rules
├── README.md                  # Comprehensive technical documentation
│
├── server/                    # Express + Mongoose Backend
│   ├── .env                   # Server environment variables
│   ├── .env.example           # Example environment template
│   ├── package.json           # Backend dependencies (express, mongoose, cors, etc.)
│   ├── server.js              # Express app entry point & middleware
│   ├── config/
│   │   └── db.js              # MongoDB connection & memory fallback
│   ├── models/
│   │   └── Todo.js            # Mongoose Todo schema & virtuals
│   ├── controllers/
│   │   └── todoController.js  # CRUD & statistics controllers
│   ├── routes/
│   │   └── todoRoutes.js      # RESTful API route definitions
│   └── seeds/
│       └── seedData.js        # Realistic initial sample todos matching reference
│
└── client/                    # Vite + React Multi-Page Application (MPA)
    ├── package.json           # Frontend dependencies (react, lucide-react, vite)
    ├── vite.config.js         # Multi-page Rollup input configuration & API proxy
    ├── index.html             # Page 1 Entry HTML (Todos List & Dashboard)
    ├── todo.html              # Page 2 Entry HTML (Dedicated Single Todo Page)
    └── src/
        ├── styles/
        │   ├── theme.css      # Design tokens (pastel lilac, cream, rounded cards)
        │   ├── dashboard.css  # Styles for Dashboard / Todos List page
        │   └── todoDetail.css # Styles for Single Todo detail view
        ├── services/
        │   └── api.js         # REST API client wrapper
        ├── components/
        │   ├── Sidebar.jsx    # Smartech branded sidebar with avatar & navigation
        │   ├── Header.jsx     # Greeting, search bar, notification bell, action buttons
        │   ├── StatGauge.jsx  # SVG circular progress widgets (Attendance/Homework/Rating)
        │   ├── CalendarCard.jsx # Schedule & calendar widget with lesson pills
        │   ├── UpcomingEventsCard.jsx # Upcoming events cards
        │   ├── LinkedTeachersCard.jsx # Mentors list with avatar & chat actions
        │   ├── ProjectsCard.jsx # Active project thumbnails
        │   ├── TodoCard.jsx   # Interactive todo card with pill tags & actions
        │   ├── TodoModal.jsx  # Create / Edit task modal dialog
        │   ├── FilterBar.jsx  # Status, category, priority filters & search
        │   └── Toast.jsx      # Feedback notification toasts
        └── pages/
            ├── main/
            │   ├── main.jsx   # Entry point for Page 1
            │   └── App.jsx    # Todos List & Dashboard View
            └── todo/
                ├── todo.jsx   # Entry point for Page 2
                └── TodoApp.jsx# Dedicated Single Todo View (?todo_id=...)
```

---

## ⚡ Getting Started & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*(Or install manually in both folders: `cd server && npm install`, then `cd ../client && npm install`)*

### 2. Start Both Server and Client Concurrently
From the root directory, run:
```bash
npm run dev
```

This starts:
- **Express Backend API**: Running on `http://localhost:5000`
- **Vite Frontend (MPA)**: Running on `http://localhost:5173`

### 3. Open the Application in Your Browser
- **Dashboard & Todos List (Page 1)**: [http://localhost:5173/index.html](http://localhost:5173/index.html)
- **Single Todo Page (Page 2)**: Navigate by clicking any task's external link icon, or directly open `http://localhost:5173/todo.html?todo_id=<id>`

---

## 📦 Production Build

To compile both frontend entry points into production-ready static assets:
```bash
npm run build
```
The optimized bundle will be generated in `client/dist/` (`index.html`, `todo.html`, and minified CSS/JS chunks), which can be served directly by the Express server via `npm start`.

---

## 🧪 Verification & Testing Completed
1. **Multi-Page Architecture**: Verified that navigating between the Todos List and Single Todo details triggers standard HTML-style multi-page navigation and extracts URL query parameters (`?todo_id=...`).
2. **RESTful CRUD Operations**: Verified creating, reading, updating (full and partial PATCH), and deleting todos.
3. **Database Fallback**: Verified zero-config automated initialization and auto-seeding.
4. **Visual Alignment**: Verified that typography, color tokens, card radius, circular gauges, calendar schedule, and sidebar match the provided Smartech reference aesthetic.
