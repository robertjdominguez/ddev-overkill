---
title: "GitHub Actions? How About Terminal Actions!"
hook: "I'm lazy, and you probably are too. Why waste time opening a browser when you can trigger your GitHub Actions from the terminal?"
slug: gh-actions
created_at: 2024-09-19T17:05:00+00:00
image: /static/images/lazy.webp
---

# GitHub Actions? How About Terminal Actions!

Let’s just admit it: I’m lazy. And if you’re reading this, you probably are too. But here’s the thing, laziness isn't necessarily a bad thing. In fact, it's the cornerstone of automation. Why waste time doing repetitive tasks manually when we can let machines do the heavy lifting?

Enter **GitHub Actions**. They’re great for automating all sorts of workflows like deployments, tests, or building docs. But even GitHub Actions, as amazing as they are, can feel a little… I don’t know… _distant_? I mean, why should I bother opening a browser, navigating to GitHub, and clicking through menus just to kick off a simple action? I have my terminal open all day anyway!

So, here’s the question I asked myself: why not just have a command in my terminal that triggers a GitHub Action? Turns out, you can. And it's ridiculously simple.

## Deploying Docs: The Lazy Way™

I work on a lot of documentation. Specifically, the docs over at Hasura, and I wanted a way to quickly trigger a workflow from the comfort of my terminal. GitHub’s API makes this _almost_ too easy. You just need to know which repo, which workflow, and which branch you want to trigger.

And voilà, here’s the function:

```bash
deploy-docs() {
local token="<get_your_own>"
local owner="hasura"
local repo="v3-docs"
local workflow="merge-staging-to-prod.yml"
local branch="release-stage"

local response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: token $token" \
    -H "Content-Type: application/json" \
    -d "{\"ref\":\"$branch\"}" \
 https://api.github.com/repos/$owner/$repo/actions/workflows/$workflow/dispatches)

if [["$response_code" -eq 204]]; then
echo "🚀 Deployment triggered successfully!"
else
echo "💩 Failed to trigger deployment. HTTP status code: $response_code"
fi
}
```

## How It Works

Let’s break this down a little. This bash function, `deploy-docs()`, does a few things:

1. **Token:** You’ll need a GitHub personal access token. (Sorry, I can't give you mine. You'll have to get your own 😜).
2. **Owner & Repo:** In this case, we're working with the `hasura/v3-docs` repository.
3. **Workflow:** This is the name of the workflow file that you want to trigger. Our's called `merge-staging-to-prod.yml`.
4. **Branch:** I’m telling it to run against the `release-stage` branch.
5. **Curl:** I use `curl` to send a `POST` request to GitHub's API to kick off the workflow. If the response code is `204`, it means success, and if not, well... let's just say 💩 happens.

## Why This Matters

Sure, I could do this all from GitHub’s UI. But where’s the fun in that? Why interrupt your flow when you’re already in the terminal, working on something more substantial or handling other tasks? This keeps everything right where I want it. More importantly, it saves time and energy. Efficiency, baby.

Plus, there’s just something _satisfying_ about running a command and seeing “🚀 Deployment triggered successfully!” pop up in the terminal. It's the little things that make an engineer's day.

So there you have it. A little snippet to trigger your GitHub Actions without leaving the comfort of your terminal. Now, go automate something else while you're at it. I know you want to.
