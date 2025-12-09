# ABC Company — Inventory Management System (scaffold)

This is a small demo scaffold for an inventory management system using Node.js, Express and SQLite.

Getting started (Windows PowerShell):

```powershell
cd "c:\Users\user\Desktop\BRI.c"
npm install
npm start
```

Open http://localhost:3000 in your browser.

- Demo user: `admin` / `admin123`
- The app stores a small SQLite DB at `database.sqlite` in the project root.

Notes:
- This scaffold is intentionally minimal for easy extension. It does NOT include production authentication, password hashing, or role-based access control. Treat it as a development starting point.

Next steps you might ask me to implement:
- Add proper authentication (JWT / bcrypt), user management
- CSV import/export, pagination, sorting
- Deployment scripts and environment variables
- React frontend instead of vanilla JS

Serverless / Netlify note
------------------------
I added Netlify serverless function files under `netlify/functions/` so you can host the frontend and API together on Netlify. Important caveats:

- The current serverless functions use an in-memory store seeded from `data/seed.json` at cold start. This means data changes are NOT persisted across function restarts or redeploys. It's suitable for demos but not production.
- For persistence on Netlify, use an external database (recommended: Supabase/Postgres, Firebase, or any hosted DB). I can integrate Supabase if you provide the project/API keys.

How to deploy (single Netlify site)

1. Push the repo to GitHub.
2. In Netlify, create a new site -> Import from Git -> choose this repo.
3. Set `Publish directory` to `public` and `Functions directory` to `netlify/functions` (Netlify usually auto-detects from `netlify.toml`).
4. Deploy. The frontend will call the serverless functions at `/.netlify/functions/<name>` — the app already supports runtime `public/config.json` if you want to change API base.

If you want persistence I recommend one of these next steps:
- I can convert functions to use Supabase for storage and authentication (preferred). You'll need a Supabase project and API keys (I can guide you to create them).
- Or deploy the current Express server to Render/Heroku (persisting with SQLite file is still limited; better to use Postgres on Render/Heroku).
