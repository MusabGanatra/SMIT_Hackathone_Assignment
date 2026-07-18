# MaintainIQ — Smart Asset Maintenance System

A lightweight asset maintenance tracker built with plain HTML/CSS/JS and Supabase.
Staff log in to register assets, each asset gets a QR code, and anyone who scans it
can report a problem — no login required for that part.

## Setup

1. Create a project at https://supabase.com
2. Open **SQL Editor** in your Supabase project, paste the contents of
   `supabase-schema.sql`, and run it. This creates the `assets`, `issues`,
   `maintenance`, and `history` tables with the right permissions.
3. Open **Project Settings → API**, copy your **Project URL** and **anon public key**.
4. Paste them into `js/supabase.js`:
   ```js
   const SUPABASE_URL = "https://xxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJ...";
   ```
5. Open `index.html` in a browser (or serve the folder with any static server).
   Register a staff account, then log in.

## Pages

| Page | Purpose | Login required |
|---|---|---|
| `index.html` | Staff login / register | – |
| `dashboard.html` | Summary counts | Yes |
| `assets.html` | Add / search / delete assets | Yes |
| `asset-details.html` | Full asset record + printable QR code | Yes |
| `maintenance.html` | Resolve open issues | Yes |
| `history.html` | Activity log | Yes |
| `public-asset.html` | What someone sees after scanning a QR code | No |
| `report-issue.html` | Public issue-reporting form | No |

## Database

See `supabase-schema.sql` for the full schema, Row Level Security policies,
and constraints.
