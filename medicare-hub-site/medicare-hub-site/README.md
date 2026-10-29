# MediCare Hub (Demo) - deploy on Vercel

Not a real or verified medical facility. For a computer exam only.

## Files
index.html, home.js, extras.js, avatars.js, theme.css, extras.css (site; avatars.js draws the original doctor portraits) | api/notify.js (sends Gmail emails) | manifest.json, sw.js, icon.svg (installable app) | vercel.json, package.json

## Turn on email notifications
1. Use a Gmail account for the site. Turn on 2-Step Verification, then create an App Password (Google Account > Security > App passwords).
2. In Vercel: Project > Settings > Environment Variables, add
   GMAIL_USER = yourname@gmail.com
   GMAIL_APP_PASSWORD = the 16-character app password
3. Redeploy. Each booking emails the patient (and BCCs you). The Help page contact form emails you.
Never put the app password in the code or in GitHub.

## Deploy
Upload this folder to GitHub and import it in Vercel (no build settings needed), or run `npx vercel` inside the folder.
Email only works on the deployed Vercel site, not when opening index.html from your computer.
