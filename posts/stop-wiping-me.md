---
title: "Stop Committing WIP and Start Committing to Better Git Practices"
hook: "Your commit history should tell a story, not look like a keyboard smash. If every other commit is just 'WIP' or 'fix', you’re not leaving breadcrumbs—you’re leaving landmines for Future You (or worse, your teammates)."
slug: stop-wiping-me
created_at: 2025-02-14T10:06:23.624571+00:00
image: /static/images/wip.png
---

# Stop Committing WIP and Start Committing to Better Git Practices

Look, we need to talk. Your commit history? It’s a mess. A string of `WIP` commits followed by a single, massive “final” commit is not a version history—it’s chaos. And Future You (or worse, your teammates) will be cursing your name when they have to dig through it.

Let’s fix that.

## Why Commit History Actually Matters

A well-structured commit history isn’t just about making your repo look pretty—it’s a **signal that you’ve thought through your work**.

A clean commit history shows:

- You **planned out your work** instead of hacking things together.
- You have **a clear roadmap of what changed and why**.
- Debugging future issues will be way easier.

Ever tried `git bisect` on a project where every commit message is “WIP” or “fix stuff”? Yeah, not fun.

## The Problem with Bad Commit Messages

If your commit history looks something like this:

```sh
WIP
WIP
still WIP
fixing last WIP
final WIP
final final (really)
```

Congratulations, you’ve created an archaeological dig site instead of a useful commit history.

A bad commit history makes it impossible to figure out what happened. And if you think, “I’ll just squash everything into one giant commit later,” you’re missing the point: commits should tell a clear, useful story as you go.

## How to Write a Good Commit Message

Here’s a simple rule: **if it’s worth committing, it’s worth describing.**

Instead of:

```sh
git commit -m "fix"
```

Do this:

```sh
git commit
# This opens your editor so you can actually write a useful message
```

A good commit message follows a simple format:

```sh
<short summary of change>

<optional longer explanation if needed>
```

Example:

```sh
feat: add authentication middleware

- Implemented JWT-based authentication
- Added user role checks
- Updated tests to cover new middleware
```

This tells you exactly what changed, why, and any relevant details. **It provides insight into your thought process.**

## The Power of Fix-Up Commits

Sometimes, you realize you need to tweak a previous commit. Instead of making another generic “fix” commit, use **fix-up commits**:

```sh
git commit --fixup <commit-hash>
```

This marks your new commit as a fix for a previous one. When you're ready, clean up the history with:

```sh
git rebase -i --autosquash
```

Boom—your history stays clean and logical.

## Make Your Life Easier with LazyGit in Neovim

If you’re working in Neovim, you owe it to yourself to use [LazyGit](https://github.com/jesseduffield/lazygit). It makes handling commits, amending changes, and rebasing **so much smoother**.

With LazyGit, you can:

- Easily stage and unstage hunks or files.
- Quickly squash, amend, or reword commits.
- Rebase interactively without memorizing arcane Git commands.

## Rebasing and Squashing Before Merging

Before merging a feature branch, **clean it up**. No one wants to review a PR with 20 commits like:

```sh
WIP
fix typo
added semicolon
another WIP
```

Instead, use:

```sh
git rebase -i HEAD~n
```

This lets you squash unnecessary commits, rewrite messages, and make your history readable.

## Final Thoughts: Git is a Tool—Use it Well

Your commit history isn’t just for you today—it’s for **everyone who touches this code later, including yourself in six months**.

A clean commit history **shows you’re organized, methodical, and intentional about your work**.

So, stop spamming `WIP` commits. Open the commit editor, write meaningful messages, and use tools like LazyGit to keep your history clean. Your future self will thank you.
