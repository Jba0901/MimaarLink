# MimaarLink Supabase Setup Notes

The app now uses Supabase for production data and uploaded files.

## What Vercel Needs

These environment variables should exist in the Vercel project:

- `POSTGRES_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_PASSWORD`

Optional:

- `SUPABASE_STORAGE_BUCKET=mimaarlink-files`

## What The App Creates Automatically

On the first API request, the app creates these database tables if they do not exist:

- `requesters`
- `projects`
- `contractors`
- `bid_invites`
- `bids`
- `admin_notes`

It also creates a private Supabase Storage bucket named `mimaarlink-files` for uploaded CR files, trade licenses, project files, and bid attachments.

## Upload Limit

Each uploaded file is limited to 10 MB.

## Simple Mental Model

- Vercel hosts the website.
- Supabase Postgres stores form/admin data.
- Supabase Storage stores uploaded files.
