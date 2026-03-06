# Codecraft

## Overview
Codecraft is a browser-based code editor that runs code remotely, stores executions, and lets users publish, comment on, and star snippets. The product is designed for fast iteration, simple sharing, and minimal backend overhead.

## System Goals
- Zero local setup for code execution
- Predictable output from a remote sandbox
- Simple sharing with safe server-side persistence
- Auth-first design without custom auth infrastructure

## Architecture
```
Browser (Next.js App Router)
  |-- Clerk (auth + user session)
  |-- Convex (data, queries, mutations, http actions)
  |-- Judge0 (code execution)
```

## Runtime Flow
1) User signs in via Clerk.
2) User writes code in Monaco and runs it.
3) The client calls Judge0 with the language ID and code.
4) Output is displayed and saved to Convex as an execution record.
5) Snippets, comments, and stars are stored in Convex and read via reactive queries.

## Tech Stack
- Frontend: Next.js 15, React 18, Tailwind CSS, Monaco Editor, Framer Motion
- Backend: Convex (queries, mutations, http actions)
- Auth: Clerk
- Execution: Judge0 (public endpoint by default)
- Tooling: TypeScript, ESLint, PostCSS, Zustand

## Project Structure
```
convex/
  auth.config.ts        Clerk issuer config for Convex
  codeExecutions.ts     Save and query execution history + stats
  http.ts               Clerk webhook handler (Svix)
  schema.ts             Convex tables and indexes
  snippets.ts           Snippet CRUD, comments, stars
  users.ts              User sync and lookup
  _generated/           Convex generated API and types

public/
  *.png                 Language icons and marketing assets

src/
  app/
    (root)/             Main editor UI
      _components/      Editor, output, header, theme/language controls
      _constants/       Language config and Monaco theme definitions
      page.tsx          Editor page
    profile/            User profile, stats, and execution history
    snippets/           Snippet list and detail views
    privacy/            Privacy page
    support/            Support page
    terms/              Terms page
    layout.tsx          App shell, providers, global layout
    globals.css         Tailwind base styles
  components/           Shared UI components
  constants/            Judge0 language IDs
  hooks/                Client-only hooks
  lib/                  External service wrappers (Judge0)
  store/                Zustand editor state
  types/                Shared TypeScript types
```

## Key Features
- Monaco editor with saved per-language code, font size control, and theme switching
- Remote code execution via Judge0 with stdout/stderr/compile output handling
- Snippet sharing with comments and star counts
- Profile dashboard with execution history and user stats
- Clerk auth integration with Convex identity enforcement

## Core Flows

### Code Execution
- Language selection maps to Judge0 IDs in `src/constants/languages.ts`.
- `executeCode` posts code to Judge0 and returns stdout, stderr, compile_output.
- The editor store marks running state, updates output, and stores an executionResult.
- When signed in, executions are persisted via `codeExecutions.saveExecution`.

### Snippets
- `snippets.createSnippet` stores title, language, code, and userName.
- `snippets.getSnippets` returns newest first for the browse page.
- Snippet detail reads the snippet and comments; missing snippets return null.
- `snippets.addComment` and `snippets.deleteComment` enforce identity.
- `snippets.starSnippet` toggles stars; `getSnippetStarCount` returns totals.

### Authentication and User Sync
- Clerk handles sign-in and session management.
- Convex uses `ctx.auth.getUserIdentity()` for all writes.
- `/clerk-webhook` in `convex/http.ts` verifies Svix signatures and syncs users.
- If a webhook has not yet fired, snippets auto-create a user record on first write.

## Data Model
Tables and indexes defined in `convex/schema.ts`:

Users
- userId (Clerk subject)
- email
- name
- index: users.by_user_id

CodeExecutions
- userId
- language
- code
- output (optional)
- error (optional)
- index: codeExecutions.by_user_id

Snippets
- userId
- title
- language
- code
- userName
- index: snippets.by_user_id

SnippetComments
- snippetId
- userId
- userName
- content
- index: snippetComments.by_snippet_id

Stars
- userId
- snippetId
- indexes: stars.by_user_id, stars.by_snippet_id, stars.by_user_id_and_snippet_id

## Convex API Surface
codeExecutions
- saveExecution
- getUserExecutions
- getUserStats

snippets
- createSnippet
- deleteSnippet
- addComment
- deleteComment
- getSnippets
- getSnippetById
- getComments
- isSnippetStarred
- getSnippetStarCount
- getStarredSnippets

users
- syncUser
- getUser

http
- POST /clerk-webhook

## State Management
- Zustand store in `src/store/useCodeEditorStore.ts` holds editor state, output, and execution status.
- Local storage persists language, theme, font size, and per-language code.

## Configuration and Environment
Environment variables (example values should go in `.env.local`, but do not commit secrets):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_JUDGE0_URL=https://ce.judge0.com
CLERK_WEBHOOK_SECRET=
```

## Security Notes
- All write operations require a valid Clerk identity.
- Webhooks are verified with Svix signatures.
- Code execution is isolated via the Judge0 sandbox.

## Performance Notes
- Monaco editor is client-only.
- Convex queries are reactive, reducing manual polling.
- Output and editor panels use internal scrolling to avoid layout shifts.

## Limitations
- Public Judge0 endpoint can be rate-limited.
- Remote execution adds latency compared to local runtimes.
- Convex abstracts database tuning; advanced indexing is limited to schema definitions.

## Local Development
```
npm install
npx convex dev
npm run dev
```
