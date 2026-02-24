# Deployment Guide

This project can be deployed easily on platforms like **Render**, **Railway**, **Vercel**, or **Netlify**.

## Backend Deployment (e.g., Render)

1.  **Create a Web Service** and connect your GitHub repository.
2.  **Environment Variables**:
    *   `SUPABASE_URL`: Your Supabase Project URL.
    *   `SUPABASE_ANON_KEY`: Your Supabase Project Anon Key.
    *   `FRONTEND_URL`: Your deployed frontend URL (e.g., `https://your-app.vercel.app`).
    *   `PORT`: Usually `10000` on Render or `5000` (it will be set automatically).
3.  **Root Directory**: `backend`
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`

## Frontend Deployment (e.g., Vercel)

1.  **Create a New Project** and connect your repository.
2.  **Environment Variables**:
    *   `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-api.onrender.com/api`).
    *   `VITE_SUPABASE_URL`: (Optional if frontend uses it directly)
    *   `VITE_SUPABASE_ANON_KEY`: (Optional if frontend uses it directly)
3.  **Root Directory**: `frontend`
4.  **Framework Preset**: Vite
5.  **Build Command**: `npm run build`
6.  **Output Directory**: `dist`

## Database Setup

1.  Go to your **Supabase Dashboard**.
2.  Open the **SQL Editor**.
3.  Copy the contents of `backend/supabase_schema.sql` and run it to create the tables and insert sample data.
