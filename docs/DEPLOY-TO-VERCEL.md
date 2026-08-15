# Deploying to Vercel — Step by Step

This guide takes your local app live on the internet. It assumes `pnpm run dev` already works on your machine — if it doesn't, fix that first (see `docs/GUIDE.md`).

**What you're deploying:** the `frontend/` app only. It's a full Next.js server (pages + Server Actions + the `/api/auth/session` route) that talks straight to Firebase using the Admin SDK — that's your real backend. The separate `backend/` Express app (Cloud Functions) is optional scaffolding; skip it unless your feature specifically calls it (see the box at the end).

Two things need to be live for the app to fully work: **Vercel** (hosts the site) and **Firestore security rules** (protects the database). Steps 1–6 cover Vercel. Step 7 covers the rules.

---

## Before you start — gather 6 values

Open your Firebase project at [console.firebase.google.com](https://console.firebase.google.com) and collect these. Keep them in a scratch note, you'll paste them into Vercel in Step 5.

| # | Value | Where to find it |
|---|-------|-------------------|
| 1 | Firebase **Project ID** | Project Settings (gear icon) → General → "Project ID" |
| 2 | Firebase **API Key** | Project Settings → General → scroll to "Your apps" → click your web app → copy `apiKey` from the config snippet |
| 3 | Firebase **Auth Domain** | Same config snippet → `authDomain` |
| 4 | Firebase **Messaging Sender ID** | Same config snippet → `messagingSenderId` |
| 5 | Firebase **App ID** | Same config snippet → `appId` |
| 6 | **Service account key** (base64) | Project Settings → Service Accounts tab → "Generate new private key" → downloads a `.json` file. See encoding command below. |

You can also just open your local `.env` file — every one of these values is already sitting there, filled in when the project was bootstrapped.

**Encode the service account key** (do this in your terminal, not by hand):

```bash
# macOS
base64 -i ~/Downloads/your-service-account-file.json | tr -d '\n' | pbcopy
```

That copies the encoded key straight to your clipboard — you'll paste it into Vercel in Step 5. Never paste this key into chat, a doc, or commit it to git.

---

## Step 1 — Push your code to GitHub

Vercel deploys from a GitHub repo. If your latest work isn't pushed yet:

```bash
git push origin <your-branch>
```

If you're not on `main` yet, open a PR and get it merged first (or ask a maintainer) — Vercel's auto-deploy is normally wired to `main`.

## Step 2 — Create a Vercel account

Go to [vercel.com](https://vercel.com) → **Sign Up** → choose **Continue with GitHub**. Authorize Vercel to access your GitHub account when prompted.

## Step 3 — Import the repo

1. On the Vercel dashboard, click **Add New...** → **Project**
2. Find your repo in the list (search if needed) → click **Import**
3. If you don't see the repo, click **Adjust GitHub App Permissions** and grant Vercel access to it

## Step 4 — Configure the project

On the "Configure Project" screen:

| Field | Set to |
|-------|--------|
| **Framework Preset** | Next.js (should auto-detect) |
| **Root Directory** | Click "Edit" next to it → select `frontend` → Continue |

Do **not** click Deploy yet — you still need to add environment variables in the next step, or the app will build but fail to connect to Firebase.

## Step 5 — Add environment variables

Still on the same screen, expand **Environment Variables** and add each row below. For each one: type the name in the left box, the value in the right box, click **Add**, repeat.

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | value #2 from your list |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | value #3 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | value #1 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | value #4 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | value #5 |
| `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` | value #6 (paste from clipboard) |
| `NEXT_PUBLIC_APP_NAME` | your app's display name, e.g. `My Capstone App` |
| `NEXT_PUBLIC_APP_URL` | leave as `https://placeholder.vercel.app` for now — you'll fix this in Step 6 |

**Checklist before continuing:**
- [ ] Every row shows a value, not blank
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` does **not** have `NEXT_PUBLIC_` in front of it (it's a secret — that prefix would expose it to the browser)
- [ ] No extra spaces at the start/end of any value (a trailing space is invisible and breaks things)

## Step 6 — Deploy, then fix the URL

1. Click **Deploy**. Wait for the build to finish (a few minutes).
2. Once it's live, copy the URL Vercel gives you (something like `https://your-app.vercel.app`)
3. Go to **Project Settings → Environment Variables**, edit `NEXT_PUBLIC_APP_URL`, and replace the placeholder with that real URL
4. Go to the **Deployments** tab → click the `...` menu on the latest deployment → **Redeploy** (so the corrected value takes effect)

**From now on, every push to `main` auto-deploys to this URL.** There's no approval step on Vercel's side — merging to `main` means it's live.

## Step 7 — Deploy Firestore security rules

This is separate from Vercel and easy to forget — without it, Firestore may reject every read/write from your live app even though the site loads fine.

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

(This also happens automatically on every push to `main` via `deploy.yml`, if that GitHub Actions workflow is set up for this repo — check the **Actions** tab on GitHub to confirm it ran.)

---

## Sanity check — is it actually working?

Visit your Vercel URL and:
1. Try signing up with a new account — if this fails, double check the `NEXT_PUBLIC_FIREBASE_*` values in Step 5
2. Try creating something that saves to Firestore (e.g. a note) — if this fails with a permissions error, Step 7 (rules) probably wasn't done
3. Refresh the page while signed in — if you get signed out, check `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` was pasted completely (it's a long string and easy to truncate when copying)

---

## Do I need to deploy `backend/` too?

Almost certainly not. That folder is a separate Express API deployed as its own Cloud Function — it only matters if your frontend code calls it directly (look for `fetch` calls to a `/api/...` URL outside of `frontend/src/app/api/auth/session`, or check `backend/src/routes/` for routes with actual code in them, not empty files). If you're not sure, ask before spending time on it — deploying it also requires upgrading Firebase to the paid Blaze plan. Full instructions are in `docs/CI-CD.md` if you do need it.
