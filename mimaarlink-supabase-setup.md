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
- `ADMIN_SESSION_SECRET`

Marketing measurement, disabled by default:

- `NEXT_PUBLIC_META_PIXEL_ID=<Meta dataset or pixel ID>`
- `NEXT_PUBLIC_META_PIXEL_ENABLED=false`

Keep `NEXT_PUBLIC_META_PIXEL_ENABLED=false` until the consent banner, privacy page, Pixel Test Events, and successful-form events have been checked in production. The Pixel ID is public by design; do not place a Conversions API access token in a `NEXT_PUBLIC_` variable.

## What The App Creates Automatically

On the first API request, the app creates these database tables if they do not exist:

- `requesters`
- `projects`
- `contractors`
- `bid_invites`
- `bids`
- `admin_notes`

The `projects` and `contractors` tables also receive a private `marketing_attribution` JSON column. It stores consented campaign source fields for admin review and is not returned by public status or bid APIs.

It also creates a private Supabase Storage bucket named `mimaarlink-files` for uploaded CR files, trade licenses, project files, and bid attachments.

## Upload Limit

Each uploaded file is limited to 2 MB, with a 3 MB total upload limit per submission while uploads still pass through Vercel.

## Simple Mental Model

- Vercel hosts the website.
- Supabase Postgres stores form/admin data.
- Supabase Storage stores uploaded files.

The admin API uses an HTTP-only browser cookie after login. If Vercel redeploys and the admin page asks you to log in again, that is normal.
