# PrepWise – Interview Preparation System

A beginner-friendly React project for the **15-day MERN Workshop**.

## How to Run

```bash
cd prepwise
npm install
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

## Demo Login

| Email | Password |
|-------|----------|
| demo@prepwise.com | demo123 |
| student@prepwise.com | 123456 |

## Project Roadmap (15 Days)

| Day | Topic | What You Build |
|-----|-------|----------------|
| 1-2 | Setup + Login | ✅ Login page, Auth, Routing |
| 3-4 | Home Page | ✅ Hero section, intro, feature cards, Start button |
| 5-6 | Dashboard | Category cards (HTML, CSS, JS...) |
| 7-8 | Question Page | Show Q&A, Reveal, Next |
| 9-10 | Mock Interview | Timer, random questions, score |
| 11-12 | Progress Tracker | Progress bar, completed count |
| 13-14 | Resources Page | Video/article cards |
| 15 | Polish | Responsive design, final testing |

## Folder Structure

```
prepwise/
├── public/
│   ├── users.json          # Mock login data (fetched with fetch API)
│   └── vite.svg            # Favicon
├── src/
│   ├── components/         # Reusable UI pieces
│   │   ├── Navbar.jsx      # Top navigation
│   │   ├── Navbar.css
│   │   ├── Footer.jsx      # Bottom footer
│   │   └── Footer.css
│   ├── context/
│   │   └── AuthContext.jsx # Login state (shared across app)
│   ├── pages/              # Full pages (one per route)
│   │   ├── Login.jsx       # Login page ⭐ START HERE
│   │   ├── Login.css
│   │   ├── Home.jsx        # Home page (after login)
│   │   └── Home.css
│   ├── App.jsx             # Routes + layout
│   ├── App.css
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML shell
├── package.json            # Dependencies
└── vite.config.js          # Vite config
```

## Concepts Used (Login Page)

- **useState** – Store email, password, error message
- **async/await** – Load users from JSON file
- **fetch** – Get data from `/users.json`
- **Conditional Rendering** – Show error only when `{error && ...}`
- **React Router** – Navigate between Login and Home
- **Context API** – Share login state with all components
- **localStorage** – Remember user after page refresh
