# Byteflow Website

The public Next.js 16 website reads published content from the shared Turso/libSQL CMS while retaining the existing layout, styling, routes, animations, and hardcoded content as a safe fallback during initial migration.

## Setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and configure the same Turso database as the admin application.
3. Run the migration and seed commands from the `byteflow admin` checkout.
4. Run `npm run dev`.

The homepage consumes CMS hero content, published services, FAQs, reviews, team records, menus, and site settings. Page SEO uses published page metadata. The contact form validates and stores enquiries, uses the configured success/error behavior, and optionally sends via Resend when `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are present.

For production, run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Both deployments must share Turso credentials and publicly accessible media storage. Never expose database, email, or authentication secrets through `NEXT_PUBLIC_` variables.
