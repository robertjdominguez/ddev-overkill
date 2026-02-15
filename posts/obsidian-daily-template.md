---
title: "Doing Less, Better: My Obsidian Daily Note Template"
hook: "A simple, structured way to work with clarity. Built around the ideas in Essentialism and Effortless, my Obsidian daily note template helps me think clearly, act deliberately, and reflect meaningfully—without turning productivity into another job."
slug: obsidian-daily-template
created_at: 2025-10-31T08:03:57.459475+00:00
image: /static/images/peter.png
---

# Doing Less, Better: My Obsidian Daily Note Template

I’ve spent a good amount of time refining my daily note template in Obsidian. What began as a simple way to track tasks has become something more deliberate: a small, repeatable system for thinking clearly and working with intention. It doesn’t try to automate my life or turn every day into a checklist. Instead, it helps me begin and end each day with a sense of purpose and awareness.

This setup draws heavily from the ideas in Greg McKeown’s _Essentialism_ and _Effortless_. The first book asks what is truly vital. The second asks how we can make those vital things easier to sustain. Together, they form a framework that reminds me to design my workday around clarity, not complexity.

## The Philosophy

Most of us are not suffering from a lack of ambition; we’re suffering from a lack of focus. We say yes too often, chase too many threads, and confuse activity with progress. _Essentialism_ reframes this by asking us to identify the few things that actually matter. _Effortless_ extends that idea by asking us to remove unnecessary friction so that doing the right thing feels natural, not draining.

My daily note template is built on those principles. It doesn’t promise to capture everything. It simply ensures that the right things are visible and the unimportant things fade quietly into the background.

## The Structure

Each note is divided into four parts:

1. **Overview**
2. **Shit to Do**
3. **Meetings**
4. **AAR (After Action Review)**

Each section has a clear purpose, and together they form a rhythm that helps me orient, act, and reflect without overcomplicating the process.

### 1. Overview

```
**What's today all about?**

**What else is going on?**
```

The Overview section helps me set the tone for the day. The first question, “What’s today all about?”, asks me to identify the central thread of the day. Sometimes it’s a theme, sometimes it’s a goal, and occasionally it’s just a mindset, but naming it forces clarity. The second question, “What else is going on?”, acknowledges the reality that no day exists in a vacuum. It lets me call out the background noise: personal errands, distractions, or events that might compete for attention.

It takes a minute or two to fill out, but it prevents me from starting the day in reactive mode. It’s not about discipline. It’s about design.

### 2. Shit to Do

This section is where I rely on automation to reduce friction:

```tasks
((due on <% tp.file.creation_date("YYYY-MM-DD") %>) OR (happens on <% tp.file.creation_date("YYYY-MM-DD") %>) OR (due before <% tp.file.creation_date("YYYY-MM-DD") %>)) AND (not done)
```

This query pulls in every task that’s due today, happening today, or overdue. It’s simple but powerful. There’s no manual curation or mental effort spent deciding what to bring forward. The system handles it. I can spend my energy on doing the work instead of managing the list.

This part of the template captures what _Effortless_ describes perfectly: clear actions, low resistance. The work still requires effort, but the setup doesn’t.

### 3. Meetings

My Meetings section syncs automatically using the Full Calendar plugin. It pulls events for the day, sorts them by start time, and formats them neatly. If I have a busy day, I see it clearly; if I have a free day, I’m reminded to protect that time.

If no events exist, the template literally prints: “No meetings scheduled for today.” Those are the moments where deep work happens.

Meetings are rarely essential, but knowing what’s on the calendar helps me carve out space for what is.

### 4. AAR (After Action Review)

At the end of the day, I close the loop with a few short prompts:

```
**What went well today?**

**What didn't go well and why not?**

**What needs to prioritized for tomorrow?**
```

The AAR is where reflection turns into learning. It doesn’t need to be long or poetic. A few sentences are enough to reveal patterns over time—what conditions led to focus, where energy was wasted, and what deserves attention tomorrow.

This practice is straight from _Essentialism_: separating the trivial from the vital. Reflection is how I make sure tomorrow’s effort is better directed than today’s.

## Why It Works

This system works because it balances structure with ease. The structure gives my day definition; the automation removes the friction that usually comes with maintaining that definition. It’s a lightweight rhythm that surfaces what matters without overwhelming me with options.

_Essentialism_ gives it focus by reminding me that doing fewer things with more care is not a compromise but a strategy. _Effortless_ gives it flow by showing that consistency depends on simplicity. When I combine both, I spend less time on logistics and more time in the work itself.

It’s not a quest for perfect productivity. It’s a quiet act of intentionality.

## Plugins and Resources

- **Templater** - Handles dynamic creation dates (`<% tp.file.creation_date %>`) and embeds logic directly into the note
- **Tasks** - Queries tasks across vaults and filters by date and completion status
- **Full Calendar** - Syncs events from external calendars and displays them in daily notes

And of course, the philosophical foundation comes from:

- _Essentialism: The Disciplined Pursuit of Less_ by Greg McKeown
- _Effortless: Make It Easier to Do What Matters Most_ by Greg McKeown

Here's the whole template:

```markdown
## Overview

**What's today all about?**

**What else is going on?**

## Shit to do

\`\`\`tasks
((due on <% tp.file.creation_date("YYYY-MM-DD") %>) OR (happens on <% tp.file.creation_date("YYYY-MM-DD") %>) OR (due before <% tp.file.creation_date("YYYY-MM-DD") %>)) AND (not done)
\`\`\`

## Meetings

<%\*
const today = tp.date.now("YYYY-MM-DD");
const fc = app.plugins.plugins["obsidian-full-calendar"];

if (fc && fc.cache) {
const allEvents = [];
const todayStart = moment(today).startOf('day');
const todayEnd = moment(today).endOf('day');

    // Get the ICS calendar
    for (const [calendarId, calendar] of fc.cache.calendars) {
        // Fetch the ICS data
        await calendar.revalidate();

        // Wait for parsing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const events = await calendar.getEvents(todayStart.toDate(), todayEnd.toDate());

        if (events && events.length > 0) {
            for (const eventWrapper of events) {
                // Extract the actual event from the array
                const event = eventWrapper[0];
                if (event && event.date === today) {
                    allEvents.push(event);
                }
            }
        }
    }

    // Sort by start time
    allEvents.sort((a, b) => {
        const timeA = a.startTime || "00:00";
        const timeB = b.startTime || "00:00";
        return timeA.localeCompare(timeB);
    });

    if (allEvents.length > 0) {
        for (const event of allEvents) {
            // Combine date and time, parse as UTC, then convert to local
            const eventDateTime = moment.utc(`${event.date} ${event.startTime}`).local();
            const startTime = eventDateTime.format("h:mm A");
            tR += `### ${startTime} - ${event.title}\n\n`;
        }
    } else {
        tR += "No meetings scheduled for today.\n";
    }

} else {
tR += "Full Calendar plugin not available.\n";
}
%>

## AAR

**What went well today?**

**What didn't go well and why not?**

**What needs to prioritized for tomorrow?**
```

## Closing Reflection

This daily note isn’t meant to track every corner of my life. It’s a guidepost that helps me start each day with clarity and end it with awareness. The goal isn’t to do more. It’s to remove the noise that prevents me from doing what’s meaningful.

When I open Obsidian in the morning, everything I need is right there—my focus, my commitments, and the space to think. I’m reminded that productivity isn’t about squeezing more in. It’s about clearing space for what actually matters.
