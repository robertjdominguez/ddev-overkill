---
title: "Lua Lua: Teaching Nginx to Think with OpenResty"
hook: "🎵 Lua Lua, oh baby — we gotta go... deeper. Here's how I learned Nginx can run Lua and changed my proxy forever."
slug: lua-lua
created_at: 2025-09-19T09:00:00.000Z
image: /static/images/louie.webp
---

# Lua Lua: Teaching Nginx to Think with OpenResty

I've been using Nginx for years — mostly as a reverse proxy or static file server — and it's always felt like a fast, stoic piece of infrastructure. Then I learned something that completely changed how I see it: **you can run [Lua](https://lua.org) inside Nginx.**

Not just header rewrites or basic rewrites. **Real logic.** Fetch a token, modify a request body, cache a value across requests.

This post is about how I discovered that, and how I used it to make Nginx do a little more thinking for me.

## The Problem

I needed to proxy requests to the [PromptQL API](https://promptql.io) — but each request required a short-lived token to be injected into the JSON body. The token only lasts 15 minutes, and I didn't want to make my clients deal with fetching
and refreshing it. We do this because there's multiple layers of complex auth requirements for both the API itself and also the underlying DDN API.

I was about to spin up a Node service to sit in front of everything, but then I found out Nginx could just handle this for me.

## Step 1: Expose Environment Variables

Nginx worker processes don't just inherit your shell environment. You have to explicitly pass through the ones you want Lua to see:

```nginx
env PROMPTQL_ACCESS_TOKEN;
env PROMPTQL_PROJECT_ID;
env PROMPTQL_TOKEN_REFRESH_URL;
```

Those variables are now available via `os.getenv()` inside Lua.

## Step 2: Add a Lua Block to `location /`

Here's where things get fun. You can run Lua code on every request, right before it gets proxied upstream:

```nginx
access_by_lua_block {
local http = require "resty.http"
local cjson = require "cjson.safe"

    local access_token = os.getenv("PROMPTQL_ACCESS_TOKEN")
    local project_id = os.getenv("PROMPTQL_PROJECT_ID")

    -- Cache short-lived token
    local cache = ngx.shared.token_cache
    local token = cache:get("promptql_token")
    if not token then
        local httpc = http.new()
        local res = httpc:request_uri(PROMPTQL_TOKEN_REFRESH_URL, {
            method = "POST",
            headers = {
                ["Authorization"] = "pat " .. access_token,
                ["x-hasura-project-id"] = project_id,
                ["Content-Type"] = "application/json",
            },
            body = "{}",
        })
        local data = cjson.decode(res.body)
        token = data.token
        cache:set("promptql_token", token, 900)
    end

    ngx.req.read_body()
    local body_data = ngx.req.get_body_data()
    if body_data then
        local body_json = cjson.decode(body_data) or {}
        body_json.ddn_headers = body_json.ddn_headers or {}
        body_json.ddn_headers["x-hasura-ddn-token"] = token
        ngx.req.set_body_data(cjson.encode(body_json))
    end

}
```

This is effectively a mini API gateway living inside your proxy layer.

## Step 3: Forward Upstream as Usual

After you've modified the body, you can still just use `proxy_pass` like normal:

```nginx
proxy_pass https://promptql_api;
proxy_set_header Content-Type application/json;
```

No extra microservice. No extra container. Just Nginx doing its job — but smarter.

## Why This is Cool

You get all the benefits of a lightweight, purpose-built middleware service — without actually writing one.

- **Fast:** Lua runs in the same worker process as Nginx.
- **Cheap:** No additional service or runtime to manage.
- **Safe:** You can strip headers, rate-limit, and log everything right at the edge.

This is one of those “why didn't I know about this sooner?” moments. You can see a full example in [this SDK](https://github.com/hasura/promptql-chat-sdk/tree/main/proxy-examples/nginx-example) I worked on.
