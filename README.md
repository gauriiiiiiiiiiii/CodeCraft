# CodeCraft
Full-stack code editor with multi-language execution, snippet sharing, and developer profiles.

## Highlights
- Monaco editor with theme and font controls
- Judge0-backed execution (no card required)
- Snippets, comments, stars, and execution history
- Clerk auth + Convex data sync
- Responsive layout with internal scrolling panels

## Stack
- Frontend: Next.js 15, React 18, Tailwind CSS, Monaco Editor
- Backend: Convex (queries, mutations, HTTP actions)
- Auth: Clerk
- Execution: Judge0 (public or self-hosted)

## Quickstart
```bash
npm install
```

Create .env.local:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_JUDGE0_URL=https://ce.judge0.com
```

Set in Convex dashboard:
```bash
CLERK_WEBHOOK_SECRET=
```

Run:
```bash
npx convex dev
npm run dev
```

## Scripts
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`

## Demo
- Local: http://localhost:3000

## Deployment 
- Frontend on Vercel
- Convex via `npx convex deploy`
- Set env vars in Vercel + Convex dashboards
