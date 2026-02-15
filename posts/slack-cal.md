---
title: "Your Calendar Should Update Your Slack Status (So You Don't Have To)"
hook: "I'm lazy. You're lazy. Let's be honest: we both know you're not going to remember to update your Slack status before every meeting. Good news: your calendar can do it for you."
slug: slack-cal
created_at: 2025-10-21T13:51:36.859296+00:00
image: https://i.giphy.com/26xBPxdgUWK809bHO.webp
---

# Your Calendar Should Update Your Slack Status (So You Don't Have To)

Here's a scenario you've definitely lived: You're deep in the zone, crushing some code, when a coworker Slacks you: "Hey, you around?" You glance at your calendar and realize you were supposed to be in a meeting that started ten minutes ago. Your Slack status? Still showing that green dot like you're available and ready to chat.

Or maybe you're grabbing lunch, or at the dentist, or heads-down on something important, but your status doesn't reflect any of that. So your teammates are pinging you, wondering why you're not responding, and you're left feeling like you need to explain yourself after the fact.

Look, we're all busy. Remembering to manually update your Slack status before every meeting, errand, or focus session? That's cognitive overhead we don't need. I'm lazy, and I'm betting you are too. So I built a thing.

## What Is slack-cal?

It's ridiculously simple: `slack-gcal-sync` syncs your Google Calendar events to your Slack status automatically. If your calendar event starts with an emoji (like "🏠 Working from home" or "🍕 Lunch break"), the service extracts that emoji and text and updates your Slack status accordingly. When the event ends, it clears the status.

No browser tabs. No manual updates. No thinking about it.

Just put an emoji at the start of your calendar event, and let the machines handle the rest.

**Examples:**

```
Calendar Event: "🏠 Working from home"
Slack Status:   🏠 Working from home

Calendar Event: "☕ Coffee break"
Slack Status:   ☕ Coffee break

Calendar Event: "Team standup"
Slack Status:   📅 Team standup
```

That last one? If your event doesn't start with an emoji, it defaults to the calendar emoji (📅). Because even boring meetings deserve some representation.

## Motivation

My calendar is packed. Slack is where my team lives. The disconnect between "what I'm doing" (calendar) and "what I look like I'm doing" (Slack status) was driving me nuts.

More than anything, I wanted to keep people informed about what I'm currently doing without having to think about it. Am I in a meeting? At lunch? Heads-down on something? My teammates shouldn't have to guess, and I shouldn't have to manually broadcast my status every time something changes.

Sure, I could manually update my status. But here's the thing: I won't. And neither will you. It's not that we're irresponsible, it's that **manual status updates are cognitive overhead masquerading as professional courtesy**.

I was using [Reclaim.ai](https://reclaim.ai/) for a while, which is a great product, but it felt like overkill for this one feature. I didn't need AI-powered calendar optimization or smart habits. I just wanted my Slack status to reflect my calendar events.

Then I looked into Zapier. Turns out, they wanted $30 USD per month for a Zap that would do exactly this. **Thirty dollars. Per month.** For something that polls an API and makes an HTTP request.

That's when the cheap lazy bastard in me woke up and said, "You know what? I can build this in an afternoon and run it for free anywhere Docker runs."

So I did. Now, my calendar is the single source of truth, and Slack reflects that in real-time. My coworkers know when I'm heads-down, when I'm in a meeting, and when I'm grabbing lunch. All without me lifting a finger. Or paying $360 a year.

## How It Works

Under the hood, `slack-gcal-sync` is a lightweight TypeScript service powered by [Bun](https://bun.sh/). It polls your Google Calendar every minute, looking for events that are about to start. When it finds one, it:

1. Checks if the event title starts with an emoji
2. Extracts the emoji and remaining text
3. Updates your Slack status with that info
4. Sets an expiration timestamp for when the event ends

The status automatically clears when the event is over. No manual intervention required.

### The Stack

- **Bun**: Because it's fast, and I wanted to try it
- **Google Calendar API**: Service account authentication for calendar access
- **Slack Web API**: User token scopes to update status
- **Docker**: Containerized for easy deployment
- **Cloud Run**: Because I wanted something that would just... run

The code is clean, modular, and surprisingly straightforward. The emoji parsing logic was the most interesting part. Unicode emoji ranges are wild, especially when you account for skin tone modifiers, zero-width joiners, and compound emojis like 👨‍💻.

Here's a peek at the emoji detection:

```typescript
function startsWithEmoji(text: string): boolean {
  const emojiRegex =
    /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;
  return emojiRegex.test(text);
}
```

Yeah, emojis are complicated. Who knew?

## Deployment

I deployed this to Google Cloud Run because:

1. It's cheap (basically free for this use case)
2. It scales to zero when idle
3. I can trigger builds from GitHub with Cloud Build

The entire setup is automated: push to `main`, Cloud Build creates a new Docker image, and Cloud Run deploys it. Secrets are stored in Secret Manager, so no `.env` files floating around.

The whole thing costs me less than a coffee per month. Actually, it's probably closer to the cost of a _sip_ of coffee.

## Lessons Learned

### Bun is still delightful

I've been using Bun as my default runtime for a while now, and it continues to deliver. The startup time is fast, the developer experience is smooth, and the TypeScript support is first-class. No more wrestling with `ts-node` or fiddling with build configs. It just works.

### Unicode emojis are a rabbit hole

I thought emoji detection would be trivial. "Just match some Unicode ranges, right?" Wrong. Emojis can have skin tone modifiers, variation selectors, and zero-width joiners. A single emoji like 👨‍💻 is actually three code points joined together. Thankfully, regex supports Unicode ranges, but it took some trial and error to get it right.

### Slack's API is great

Slack's Web API is well-documented and easy to work with. The user token scopes are straightforward, and the `users.profile.set` method does exactly what you'd expect. No surprises, no gotchas. Just a clean API that gets out of your way.

### Service accounts make Google Calendar simple

Instead of dealing with OAuth flows and user consent screens, I used a service account for Google Calendar access. You just share your calendar with the service account's email, and you're done. It's perfect for personal automation like this.

## Nice to Haves

This was a quick afternoon build, so there's plenty of room for improvement:

### Multi-calendar support

Right now, it only watches one calendar. But most people have multiple calendars (work, personal, etc.). Adding support for multiple calendars with priority rules would be useful.

### Status templates

It would be cool to define templates for certain types of events. For example, all "1:1" meetings could automatically get a "🗣️ In a 1:1" status, regardless of the title.

### Retroactive syncing

If you restart the service, it doesn't check for currently active events. It only looks for upcoming ones. Adding a check on startup to sync with any active events would be a nice touch.

### Better logging

Right now, it just logs to stdout. Adding structured logging with log levels would make debugging easier in production.

## Final Thoughts

This is one of those projects that falls squarely into the "scratching my own itch" category. It solves a real problem I had, and it does it in a way that requires zero ongoing effort from me.

That's the best kind of automation: the kind you set up once and forget about. Your calendar becomes the single source of truth, and your Slack status just... works.

If you're tired of manually updating your Slack status (and let's be honest, you are), check out the [repo](https://github.com/robertjdominguez/slack-gcal-sync). It's open-sourced, easy to deploy, and ready to make you look more organized than you actually are.

Now, if you'll excuse me, my calendar says I have a "☕ Coffee break" in five minutes. My Slack status will reflect that automatically. Because I'm lazy. And proud of it.
