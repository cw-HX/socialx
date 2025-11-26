# SocialeX

This is a social media application with in-app chatting, stories, posts and more.

This repo contains two folders:

- `client/` — React frontend
- `server/` — Express + Socket.IO backend

IMPORTANT: Socket.IO requires a server that supports long-lived WebSocket connections. Vercel serverless functions do not support persistent WebSocket connections. Recommended deployment:

- Frontend: Vercel
- Backend: Render (or Railway / Fly / DigitalOcean App Platform)

See deployment instructions in the `Deployment Guide` section below.

## Deployment Guide (quick)

1. Create a GitHub repo and push this project.
2. Deploy backend to Render and set env vars (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`).
3. Deploy frontend to Vercel (root: `client`) and set `REACT_APP_API_URL` to your backend URL.
4. Update `FRONTEND_URL` in Render to your Vercel URL and redeploy backend.

Full instructions are available in the repository `README` after pushing.
