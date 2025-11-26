# Deployment Guide — SocialeX (Single-host backend, Vercel frontend)

This guide walks through pushing your code to GitHub and deploying the frontend to Vercel and the backend to Render (recommended for Socket.IO). It also covers a single-host option where Express serves the built React app.

---

## 1) Prepare repository

- Ensure `.gitignore` contains `node_modules`, `.env`, and `client/build` (already done).
- Commit your changes:

```bash
git add .
git commit -m "Prepare for deployment: env vars, static serving"
git push origin main
```

If you do not have a remote, create a GitHub repo and push:

```bash
git remote add origin https://github.com/<your-username>/SocialeX.git
git push -u origin main
```

---

## 2) Backend (Render) — recommended for WebSockets/Socket.IO

1. Create account on Render (https://render.com)
2. New → Web Service → Connect your GitHub repository
3. Choose the `server` directory as the root for the service (if monorepo, set the root path)
4. Build and Start commands
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Env vars (in Render dashboard → Environment):
   - `MONGO_URI` = `mongodb+srv://wsec:...@library.khrrfqj.mongodb.net/socialeX?retryWrites=true&w=majority`
   - `JWT_SECRET` = (generate a strong secret)
   - `FRONTEND_URL` = `https://<your-vercel-url>` (after frontend is deployed)
6. Deploy — verify logs show `Connected to MongoDB successfully` and `Running @ <PORT>`

Notes: Render supports WebSockets out of the box and sets a dynamic `PORT` environment variable.

---

## 3) Frontend (Vercel)

1. Create account on Vercel and connect your GitHub repo
2. Create a new project and select the `client` directory (Vercel auto-detects CRA)
3. Add Environment Variables in Vercel project settings (Environment → Production):
   - `REACT_APP_API_URL` = `https://<your-render-backend-url>` (do this after backend deploy)
4. Deploy — Vercel will build and provide a public URL

---

## Single-host option (serve client from Express)

If you prefer a single host (serve both backend APIs and built frontend from same server), use these steps:

1. Build the client locally:

```bash
cd client
npm install
npm run build
```

2. Copy `client/build` to server (the code already serves `client/build` when `NODE_ENV=production`)

3. Start the server with env vars set (example PowerShell):

```powershell
$env:MONGO_URI="mongodb+srv://wsec:...@library.khrrfqj.mongodb.net/socialeX?retryWrites=true&w=majority"
$env:JWT_SECRET="a_strong_secret"
$env:FRONTEND_URL="http://localhost:6001"
$env:NODE_ENV="production"
cd server
npm install
npm start
```

Open `http://localhost:6001` to view the app.

---

## 4) Post-deploy checks

- Try `Register` and `Login` from the frontend.
- Watch server logs for incoming requests.
- If Socket.IO fails to connect, ensure `FRONTEND_URL` in server CORS and Socket.IO matches the frontend origin.

---

## 5) Security and housekeeping

- Do NOT commit credentials. Keep them in Render/Vercel environment variables.
- Rotate `JWT_SECRET` and MongoDB credentials if leaked.
- Use HTTPS (Render & Vercel provide it automatically).

---

If you want, I can:
- Push the repository to a new GitHub repo (I can create a commit, but I cannot add your GitHub remote without your credentials).
- Walk you interactively through the Render and Vercel dashboards and the exact environment var values.
- Create a Dockerfile for a single-image deployment.
