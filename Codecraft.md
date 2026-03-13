# Codecraft 

## High-Level Overview
- **Problem solved**: a browser-based playground for running code remotely, sharing snippets, and building a community around code execution and reuse. 
This is evident from the editor and output UI in `src/app/(root)/page.tsx`, remote execution flow in `src/store/useCodeEditorStore.ts` + `src/lib/judge0.ts`, and snippet/community surfaces in `src/app/snippets`.

- **Target users**: developers who want a quick in-browser code runner and a way to share and discuss code. The product surfaces for snippets, comments, and stars are implemented in `src/app/snippets` and `convex/snippets.ts`.
- **Core functionality**:
  - Run code remotely using Judge0 (`src/lib/judge0.ts`).
  - Persist execution history (`convex/codeExecutions.ts`).
  - Publish and browse snippets with comments and stars (`convex/snippets.ts`, `src/app/snippets`).
  - Auth and user identity via Clerk (`src/app/layout.tsx`, `src/middleware.ts`, `convex/auth.config.ts`, `convex/http.ts`).

## Architecture
- **Style**: single Next.js App Router frontend (monolithic web app) with a backend-as-a-service model through Convex (queries/mutations/HTTP action). No custom API routes inside Next.js are defined.
- **Client/server split**:
  - UI/UX and state live in `src/app/**`, `src/components/**`, `src/store/useCodeEditorStore.ts`.
  - Data and auth enforcement are in Convex functions: `convex/*.ts`.
  - Remote execution is done via the Judge0 HTTP API in `src/lib/judge0.ts`.
- **Folder structure and responsibilities**:
  - `src/app/(root)`: main editor UI and controls (`EditorPanel.tsx`, `OutputPanel.tsx`, `Header.tsx`).
  - `src/app/snippets`: snippet list and detail views plus comment UI.
  - `src/app/profile`: profile stats, execution history, and starred snippets.
  - `src/components`: shared UI like `NavigationHeader.tsx`, `Footer.tsx`, `LoginButton.tsx`.
  - `src/store`: client state in Zustand.
  - `convex/`: schema plus queries/mutations and webhook HTTP handler.

## Technology Stack
- **Languages**: TypeScript throughout (app + Convex), CSS via Tailwind.
- **Frameworks and libraries** (from `package.json`):
  - Next.js 15 + React 18 (App Router) for UI.
  - Convex for serverless data layer and reactive queries.
  - Clerk for authentication and session management.
  - Monaco editor (`@monaco-editor/react`) for code editing.
  - Framer Motion for animations in UI.
  - Zustand for client state management.
  - `react-syntax-highlighter` for code rendering in comments and profile views.
- **Why these choices** (inferred from usage):
  - Convex simplifies reactive data fetching with `useQuery` and `useMutation` (`src/app/snippets/page.tsx`, `src/app/profile/page.tsx`).
  - Clerk handles auth and UI controls with minimal custom implementation (`src/app/layout.tsx`, `src/middleware.ts`).
  - Judge0 enables remote execution without maintaining runtimes (`src/lib/judge0.ts`).

## Core Components and Interactions

### Editor and Execution Flow
- **State and logic**: `src/store/useCodeEditorStore.ts`.
  - Keeps `language`, `theme`, `fontSize`, `editor`, `output`, `error`, `isRunning`, `executionResult`.
  - Persists language/theme/font size and per-language code in `localStorage`.
  - `runCode()` calls `executeCode` in `src/lib/judge0.ts` and updates state for output/error.
- **UI**:
  - `EditorPanel.tsx` renders Monaco editor and handles font size, reset, and share dialog.
  - `OutputPanel.tsx` renders execution output/error and copy-to-clipboard.
  - `RunButton.tsx` calls `runCode()` and saves execution results via Convex.
- **Execution persistence**:
  - `RunButton.tsx` calls `api.codeExecutions.saveExecution` after a successful run when user is signed in.
  - `convex/codeExecutions.ts` persists the record with `userId` from `ctx.auth.getUserIdentity()`.

### Snippet Creation, Browsing, and Interaction
- **Create snippet**: `ShareSnippetDialog.tsx` uses `api.snippets.createSnippet`.
  - On submit, it reads code from `useCodeEditorStore` and writes to Convex.
- **Browse snippets**: `src/app/snippets/page.tsx` queries `api.snippets.getSnippets` and filters in-memory.
  - Supports search and language filters; view toggle (grid vs list).
- **Snippet detail**: `src/app/snippets/[id]/page.tsx` displays the snippet with Monaco in read-only mode and comment thread.
- **Stars**:
  - UI: `src/components/StarButton.tsx`.
  - Data: `convex/snippets.ts` implements `starSnippet`, `isSnippetStarred`, and `getSnippetStarCount`.

### Comments
- **Rendering**: `CommentContent.tsx` parses triple-backtick code fences and renders code blocks via `CodeBlock.tsx` (syntax highlighting).
- **Adding and deleting**: `CommentForm.tsx` and `Comments.tsx` call Convex mutations `addComment` and `deleteComment`.
- **Server enforcement**: `convex/snippets.ts` checks identity for all comment mutations and only allows deletion by the author.

### Profile and User Stats
- **Profile data**: `src/app/profile/page.tsx` fetches user, stats, and execution history.
- **Stats computation**: `convex/codeExecutions.ts` `getUserStats` aggregates executions and starred snippets, and computes favorite/most-starred languages.
- **Execution history**: `usePaginatedQuery` in `src/app/profile/page.tsx` uses `getUserExecutions` with Convex pagination.

### Auth and User Sync
- **Clerk**: `src/app/layout.tsx` wraps the app in `ClerkProvider`.
- **Middleware**: `src/middleware.ts` applies Clerk auth for all routes.
- **User sync**: `convex/http.ts` handles `/clerk-webhook` and calls `api.users.syncUser` on `user.created`.
- **Fallback**: `convex/snippets.ts` auto-creates the user record if webhook has not fired yet.

## Algorithms and Logic Highlights
- **Language selection and editor content persistence**: `useCodeEditorStore.ts` keeps per-language code via `localStorage` keys `editor-code-${language}` and swaps code when changing languages.
- **Execution flow**:
  - `runCode()` performs request to Judge0 via `executeCode`, maps compile errors to `error` state, and trims output.
  - Complexity is dominated by the remote call; in-process operations are $O(n)$ where $n$ is output length.
- **Snippet filtering on the client**: `src/app/snippets/page.tsx` filters the full list in-memory with string matching. Complexity is $O(N * L)$ where $N$ is snippets count and $L$ is string length.
- **Profile stats aggregation**: `convex/codeExecutions.ts` `getUserStats` collects all executions and stars, then reduces to compute language counts. Time is $O(E + S)$ with $E$ executions and $S$ stars; memory is $O(L)$ for language counts.
- **Comment parsing**: `CommentContent.tsx` uses a regex split on code fences and then line-splits on remaining text. Complexity is $O(n)$ for content length.

## Data Handling
- **Database**: Convex tables defined in `convex/schema.ts`.
- **Schemas and indexes**:
  - `users`, `codeExecutions`, `snippets`, `snippetComments`, `stars` with index usage in queries.
- **CRUD flows**:
  - `snippets` table: create, delete, list, get by id, star toggling and counts.
  - `snippetComments` table: add and delete, and list by snippet id.
  - `codeExecutions` table: insert and list by user id with pagination.
  - `users` table: sync on webhook, read for profile display.

## API Design (Convex)
- **Mutations**:
  - `codeExecutions.saveExecution` in `convex/codeExecutions.ts`.
  - `snippets.createSnippet`, `snippets.deleteSnippet`, `snippets.addComment`, `snippets.deleteComment`, `snippets.starSnippet` in `convex/snippets.ts`.
  - `users.syncUser` in `convex/users.ts`.
- **Queries**:
  - `codeExecutions.getUserExecutions` and `codeExecutions.getUserStats`.
  - `snippets.getSnippets`, `snippets.getSnippetById`, `snippets.getComments`, `snippets.isSnippetStarred`, `snippets.getSnippetStarCount`, `snippets.getStarredSnippets`.
  - `users.getUser`.
- **HTTP endpoint**:
  - `/clerk-webhook` in `convex/http.ts` verifies Svix signatures and handles `user.created`.

## System Design Considerations
- **Scalability**:
  - Convex handles data scaling; read patterns use indexes on `users`, `codeExecutions`, `snippetComments`, `stars`.
  - Client-side filtering of snippets (`src/app/snippets/page.tsx`) will become expensive at scale and should be offloaded to server queries if dataset grows.
- **Performance**:
  - Monaco is client-only and wrapped with `useMounted` to avoid hydration mismatch (`src/hooks/useMounted.tsx`).
  - Skeleton UIs provide loading states (`EditorPanelSkeleton.tsx`, `SnippetsPageSkeleton.tsx`, `SnippetLoadingSkeleton.tsx`).
  - Output and editor are scroll-contained to avoid layout shift.
- **Error handling**:
  - `executeCode` throws on non-200 responses; `runCode` converts it into an error state for UI.
  - Convex mutations throw on auth errors (e.g., `saveExecution`, `createSnippet`), surfaced by UI toasts.

## Security Aspects
- **Authentication**:
  - Clerk middleware in `src/middleware.ts` guards routes.
  - Convex mutations check `ctx.auth.getUserIdentity()` for all writes (`convex/codeExecutions.ts`, `convex/snippets.ts`).
- **Webhook verification**:
  - `convex/http.ts` verifies Svix signatures using `CLERK_WEBHOOK_SECRET`.
- **Data protection**:
  - No explicit encryption at rest in code; relies on Convex and Clerk defaults.
  - Comment content is stored as raw string; there is no server-side HTML sanitization in the code shown.

## Testing
- No unit or integration tests are present in the repository. There are no test files or test scripts in `package.json`.

## DevOps / Configuration
- **Scripts**: `npm run dev`, `build`, `start`, and `lint` in `package.json`.
- **TypeScript config**: `tsconfig.json` uses strict mode and Next.js plugin.
- **Tailwind/PostCSS**: `tailwind.config.ts` and `postcss.config.mjs`.
- **Environment variables in use**:
  - `NEXT_PUBLIC_CONVEX_URL` (Convex client) in `src/components/providers/ConvexClientProvider.tsx`.
  - `NEXT_PUBLIC_JUDGE0_URL` in `src/lib/judge0.ts`.
  - `CLERK_WEBHOOK_SECRET` in `convex/http.ts`.

## Strengths (Engineering Quality)
- Clear separation of UI, state, and data layers (App Router + Zustand + Convex).
- Sensible data modeling with indexes for common access patterns (`convex/schema.ts`).
- Auth enforcement on server-side mutations (Convex functions check identity).
- Good UX details: skeleton loading states, copy buttons, and filtered lists.
- Modular components and consistent UI patterns across pages.

## Potential Improvements (Grounded in Current Code)
- **Server-side search/filtering**: Move snippet search and language filters to Convex queries to avoid large client payloads (`src/app/snippets/page.tsx`).
- **Rate limiting and abuse prevention**: Add throttling for Judge0 calls and comment/snippet creation to prevent spam and excessive remote execution (`src/store/useCodeEditorStore.ts`, `convex/snippets.ts`).
- **Comment sanitization**: The comment content is stored as raw string and rendered as HTML-like text; consider server-side validation/sanitization (`convex/snippets.ts`, `CommentContent.tsx`).
- **Observability**: Add structured logging around webhook failures and execution errors (`convex/http.ts`, `useCodeEditorStore.ts`).
- **Testing**: Add tests for Convex mutations and critical UI flows (no tests currently).

## How to Explain This Project in an SDE Interview

### 1-2 Minute Pitch
"Codecraft is a Next.js App Router web app that lets developers write code in Monaco, run it remotely via Judge0, and share snippets with comments and stars. Auth is handled by Clerk, and all data persistence is managed by Convex, which provides reactive queries and identity-aware mutations. The key flow is: the editor state is stored in a Zustand store, `runCode()` calls Judge0, output is rendered in the UI, and executions are saved to Convex for profile analytics. Snippets and comments are also Convex-backed with proper auth checks and indexing for efficient queries."

### Key Technical Highlights
- Remote execution integration via `src/lib/judge0.ts` with robust error mapping in `useCodeEditorStore.ts`.
- Convex schema + auth-guarded mutations for snippets, comments, stars, and execution history (`convex/*.ts`).
- Client-side state and persistence using Zustand and `localStorage` for per-language code and settings.
- Profile analytics derived from persisted execution records (`convex/codeExecutions.ts`).

### Possible Follow-Up Questions
- How would you handle scale for snippet search and filtering? (Answer: move to server-side query and add indexing.)
- How would you secure and rate-limit remote execution? (Answer: add per-user quotas, server-side validation, and a queue.)
- How would you test Convex mutations and the editor flow? (Answer: unit tests for server logic + Playwright for UI flows.)
- How would you evolve this into a multi-tenant or enterprise offering? (Answer: add org/workspace models, RBAC, audit logs.)
