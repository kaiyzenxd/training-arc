# Training Arc — Setup Guide (read me first)

This explains, very simply, how this project is put together and how to get it
onto GitHub. You do **not** need to do any of this yet — it's here for when we're
ready to build.

---

## The big picture (one repo)

Think of a **repo** ("repository") as one box that holds all your project files
and remembers every change you ever make to them.

We are using **one box** for everything:

```
Training Arc/         <- the box (this is the repo)
├── Website/          <- the portfolio site (goes live on Vercel)
├── Workflow/         <- where you build n8n workflows
├── .claude/skills/   <- helper skills (added later)
├── .gitignore        <- a list of files the box should IGNORE
└── SETUP.md          <- this file
```

Why one box instead of two? It's simpler to manage, and you'll see everything in
one place on GitHub — good for learning.

---

## Words you'll see, in plain terms

| Word | What it actually means |
|---|---|
| **Git** | A program on your computer that tracks changes to files. |
| **Repo** | The folder Git is tracking (our `Training Arc/` folder). |
| **Commit** | A saved snapshot. Like hitting "save" in a video game — you can always come back to it. |
| **Branch** | A separate line of work. `main` is the real one. You make others to try things safely. |
| **GitHub** | A website that stores a copy of your repo online so it's backed up and shareable. |
| **Push** | Send your latest commits from your computer up to GitHub. |
| **Pull** | Bring changes from GitHub down to your computer. |
| **Remote** | The nickname for the GitHub copy. Usually called `origin`. |
| **Vercel** | A service that takes your `Website/` folder and puts it on the internet automatically. |

---

## What's already done on your machine

- Git is installed (version 2.54).
- Git knows who you are: name **Maru**, GitHub user **kaiyzenxd**.
- Node.js is installed (v25) — needed for the website.
- The GitHub CLI (`gh`) is **not** installed. Optional; we can use the website instead.

---

## Step-by-step: putting Training Arc on GitHub

Do these **in order**, one at a time. Copy each command exactly.
Open a terminal in the `D:\Training Arc` folder first.

> **One command per line.** When a step shows two lines, run the first, press
> Enter, wait for it to finish, then run the second. Pasting both on one line
> mashes them together and Git throws an error like
> ``error: unknown switch `m` ``.

### 1. Create the ignore list

Some files should never go into the box (secrets, huge auto-generated folders).
We'll create a `.gitignore` file for that when we start building. It will include
things like `node_modules/`, `.env`, and `.next/`.

### 2. Turn the folder into a repo

```
git init
```

This creates a hidden `.git` folder. That hidden folder **is** the box's memory.
Don't touch it.

### 3. Take the first snapshot

```
git add .
git commit -m "First commit: project plans"
```

- `git add .` = "put all current files into the next snapshot"
- `git commit -m "..."` = "take the snapshot, and label it with this message"

### 4. Make an empty repo on GitHub

Go to <https://github.com/new> and:

- **Repository name:** `training-arc` (or whatever you like)
- **Public** (so it's a real portfolio) or **Private** (you can flip it later)
- **Do NOT** check "Add a README" / "Add .gitignore" / "Add license" —
  leave it completely empty, or the next step gets messy.
- Click **Create repository**.

### 5. Connect your computer's box to the GitHub box

GitHub will show you a URL. Use it here:

```
git remote add origin https://github.com/kaiyzenxd/training-arc.git
git branch -M main
git push -u origin main
```

- Line 1: "the online copy is called `origin`, and it lives at this URL"
- Line 2: "name my main line of work `main`"
- Line 3: "send everything up, and remember this link for next time"

The first push may ask you to sign in to GitHub in a browser window. That's normal.

### 6. From now on

Every time you change files and want to save them online:

```
git add .
git commit -m "short description of what you changed"
git push
```

That's the whole daily loop.

---

## Step-by-step: putting the website online (Vercel)

Do this **after** the website actually exists (build phase). Quick preview:

1. Go to <https://vercel.com> and sign in **with your GitHub account**.
2. Click **Add New → Project**, pick the `training-arc` repo.
3. Vercel asks for settings. Set **Root Directory** to `Website`.
   (This tells Vercel: "the site is in that subfolder, not the top.")
4. Click **Deploy**. Wait ~1 minute.
5. You get a live URL like `training-arc.vercel.app`.
6. After this, **every `git push` automatically updates the live site.** No extra steps.

---

## Safety rules (important)

1. **Never commit secrets.** No API keys, no passwords, no `.env` file contents.
   That's what `.gitignore` is for. If you're unsure, ask before pushing.
2. **The n8n API key stays local.** It goes in an ignored file, never in a commit.
3. **Public repo = the whole world can read every file and every past commit.**
   Deleting a secret later does NOT remove it from history. Prevention only.
4. When in doubt, run `git status` — it shows exactly what will go into the next
   snapshot before you commit.
