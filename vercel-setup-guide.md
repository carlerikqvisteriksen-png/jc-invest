# Vercel Deployment Guide for JC Invest

## Do I need a new Vercel project?
**YES, absolutely.**

You should create a separate Vercel project for "JC Invest" to keep it completely isolated from "Carls Life".

## Why?
- **Separate Environment Variables:** Each project will needs its own Supabase keys, API keys, etc.
- **Separate Deployments:** Pushing to JC Invest shouldn't trigger a build for Carls Life.
- **Clean History:** You want a fresh deployment history for this new app.

## How to do it (Recommended Flow)
1.  **Create a new GitHub Repository** called `jc-invest`.
    -   *If you haven't already:*
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/jc-invest.git
        git push -u origin main
        ```
2.  **Go to Vercel Dashboard** and click **"Add New..."** -> **"Project"**.
3.  **Import** the `jc-invest` repository.
4.  **Configure Project:**
    -   **Framework Preset:** Vite
    -   **Root Directory:** `./` (default)
    -   **Environment Variables:** Add your Supabase keys here later.
5.  **Deploy.**

Once linked, your local `deploy.sh` script (which runs `git push`) will automatically trigger a new build on this specific Vercel project.
