---
title: "Hunting Bugs with Git Bisect"
hook: "Ever had a weird bug show up and couldn't remember when it started? Same. Here's how I used git bisect to track it down without losing my mind (or my weekend)."
slug: bug-hunt
created_at: 2025-03-21T17:10:00.000Z
image: https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWpvOHlzdzB2ZTB4am53dzBrMXM2aHVmb2Nod24yNzFkeTdyaWpsZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vRkwv2Yz6i8rDwY/giphy.gif
---

# Git Bisect: Your New Favorite Debugging Tool

You ever open your site one day, spot a weird rendering glitch, and think, “Huh, that wasn’t there yesterday...”? That was me recently while working on our docs site. Something was breaking — but only in one browser — and I had no idea when it started or what commit caused it.

Spoiler: I didn’t panic. I used `git bisect`, and within a short time, I’d hunted down the exact commit that introduced the bug. Let’s walk through how it works, and why it’s pure magic.

## What Even _Is_ Git Bisect?

Think of `git bisect` like CSI for your commit history. You give Git two data points:

- A **bad** commit where the bug is present
- A **good** commit where everything still worked

Then Git runs a **binary search** between those two commits. That means instead of checking every single commit (painful), it checks the one in the middle, then narrows the range based on whether that commit is good or bad — rinse and repeat. Efficient and painless.

## My Recent Use Case

Here’s how I used it in the wild:

1. **Marked the latest commit as bad:**  
   I knew the bug existed in the most recent commit on `main`, so I kicked things off:

   ```bash
   git bisect start
   git bisect bad
   ```

2. **Marked the first commit as good:**  
   Confident that the bug wasn’t around at the dawn of time, I marked the initial commit:

   ```bash
   git rev-list --max-parents=0 HEAD # I used this (thanks LLMs!) to find the first commit since there's nearly 1000
   git bisect good <first-commit-sha>
   ```

3. **Git takes the wheel:**  
   From there, Git checked out a commit halfway through the history and asked me, "Is the bug here?"

   I’d:

   - Build the docs site at that commit
   - Test it
   - Mark the commit as good or bad:

   ```bash
   git bisect good # if bug-free
   git bisect bad # if the bug's still there
   ```

4. **A few rounds later…**  
   Git pointed at a specific commit and said, _“This. This is the culprit.”_

   All I had to do was:

   ```bash
   git bisect reset
   git revert <offending-commit-sha>
   ```

   Bug gone. Life good.

## Why Bisect Rules

- **It’s fast.** Binary search means you only check log₂(N) commits. Have 1000 commits? That’s just ~10 tests.
- **It’s simple.** No fancy tooling or deep debugging skills needed. Just build, test, mark.
- **It’s accurate.** No guessing. You’ll know _exactly_ when and where the issue started.

## Pro Tip

`git bisect` shines when bugs are reproducible. If you can easily check whether something is broken or not, you're golden. Also, automate testing when possible — you can even run `git bisect run <script>` to have it test for you.

## Final Thoughts

Whether you’re debugging a rendering issue, a performance regression, or anything else that mysteriously started happening “at some point,” `git bisect` is your secret weapon.

Let Git do the detective work. You just sip your coffee (okay, beer) and enjoy watching your bug get caught in the act.
