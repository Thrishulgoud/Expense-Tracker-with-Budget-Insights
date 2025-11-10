# Expense Tracker with Budget Insights

A minimal React + Firebase expense tracker with Chart.js analytics.

Features
- Income vs expense tracking
- Monthly reports and insights
- Data export (CSV, PDF)

Tech stack
- React.js
- Firebase (Firestore)
- Chart.js (via react-chartjs-2)
- jsPDF for PDF export

Quick start
1. Install dependencies:

```bash
# from project root
npm install
```

2. Configure Firebase
- Create a Firebase project, enable Firestore
- Copy your Firebase web config into `src/firebaseConfig.js`

3. Run the dev server:

```bash
npm start
```

Notes
- By default the app falls back to localStorage/demo-data if Firebase is not configured.
- CSV and PDF export are implemented in `src/utils/export.js`.

Next steps / ideas
- Add authentication to separate user data
- Improve Firestore security rules
- Add monthly budgeting and alerts
