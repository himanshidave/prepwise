# PrepWise – Local Setup Instructions

This folder contains the complete PrepWise source code, including the new landing page and the removal of the Resources section.

## How to run locally
1. **Open a terminal** (PowerShell or Command Prompt).
2. **Navigate to the project directory**:
   ```powershell
   cd "C:\Users\HP\.gemini\antigravity\brain\cf782ca8-3e45-4218-8a05-b6ec300150fe\prepwise_project"
   ```
3. **Install dependencies**:
   ```powershell
   npm install
   ```
4. **Start the development server**:
   ```powershell
   npm run dev
   ```
   The app will start (usually on http://localhost:5174) and you can open that URL in a browser.

## Production build (optional)
If you want a production‑ready build:
```powershell
npm run build
```
The compiled files will be placed in the `dist` folder.

## Demo login credentials
- **Email:** `demo@prepwise.com`
- **Password:** `demo123`

Feel free to explore, modify, or extend the project as needed.
