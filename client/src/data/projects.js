export const projects = [
  {
    title: 'Resume Generator',
    tagline: 'AI-assisted, job-tailored resume pipeline',
    description:
      'A resume-generation system that separates content from presentation: a structured, versioned ledger of achievements is paired with a formatting spec, and an AI agent assembles a tailored, ATS-aware resume for any job posting on demand — turning resume writing into a repeatable process instead of manual editing.',
    tags: ['Claude', 'Automation', 'Templating'],
    link: 'https://christophergoodale.github.io/resume_work/',
    repo: 'https://github.com/ChristopherGoodale/resume_work',
  },
  {
    title: 'Prediction Arbitrage Bot',
    tagline: 'Cross-market pricing inconsistency detector',
    description:
      'A research tool for detecting risk-free-in-theory arbitrage across prediction markets (Kalshi, Polymarket) and eventually sportsbook odds, evaluated net of fees, order-book depth, and annualized return on locked capital. Includes a live P&L dashboard visualizing win rate, drawdown, and per-trade performance on demo data.',
    tags: ['Python', 'Trading', 'Data'],
    link: 'https://christophergoodale.github.io/prediction_arbitrage_bot/',
    repo: 'https://github.com/ChristopherGoodale/prediction_arbitrage_bot',
  },
  {
    title: 'Habit / Task Tracker',
    tagline: 'Full-stack CRUD, no framework magic',
    description:
      'Project #1 in a C# / Go / React skill-building sequence: a CRUD habit/task tracker with a Go backend and a React frontend, backed by Postgres. No auth, no real-time — the goal is to feel the full request → API → DB → UI loop end to end with plain net/http, plain SQL, and plain fetch.',
    tags: ['Go', 'React', 'Postgres'],
    link: 'https://github.com/ChristopherGoodale/habit_task_tracker',
    repo: 'https://github.com/ChristopherGoodale/habit_task_tracker',
  },
]
