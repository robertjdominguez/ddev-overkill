---
title: "Make the Essential Effortless"
hook: "If you're looking at making yourself more disciplined, it helps to make things as effortless as possible. Automation is a beautiful thing when it helps you achieve your goals."
slug: new-year-same-me
created_at: 2025-01-02T10:15:00.000Z
image: /static/images/narcos.png
---

# Make the Essential Effortless

## New year, same me

Ah, the start of a new year. It's that magical time when everyone around me suddenly transforms into life coaches,
declaring war on carbs, screen time, and their snooze buttons.

As for me? I'm staying the same old me. I know what works, and I know that trying to "discipline" myself into a new
routine will only last until the first hiccup. Instead, I prefer to engineer my life to make the essential effortless.

Moving to San Francisco soon means trading in my dual 27" monitor setup for a more humble workspace—because let's be
honest, my wife isn't about to let our living room double as a command center.

The goal this year is simple: clear lines between the start and end of the workday. That’s where routines and a little
automation come in.

## Routines

Routines are my bread and butter. They let me conserve mental energy for the things that matter and ensure I start and end
each day on the right note. Whether it’s launching the apps I need to tackle the day or closing everything down at
night, having predictable patterns makes life smoother.

## Starting the day

Mornings for me are about getting into the flow quickly. That means reviewing what came through while I was offline,
setting up my apps, and organizing my workspace.

### What this looks like:

1. **Opening the essentials**: Todoist, Linear, Slack, email, calendar, and my GitHub/Discord spreadsheet.
2. **Arranging spaces**: Using macOS and Yabai to ensure everything is in its place.
3. **Focus mode**: Once everything's up and running, I’m locked in.

Here’s a script I use to automate this process:

```sh
#!/bin/bash

# Open applications
# Monitor 2, space 2
# Open tabs
open -na "Google Chrome" --args     --new-tab "https://mail.google.com/mail/u/0/#inbox"     --new-tab "https://calendar.google.com/calendar/u/0/r/week"     --new-tab "<spreadsheet>"
open -a "Slack"
# Monitor 1, space 1
open -a "Linear"
open -a "Todoist"
# Monitor 2, space 3
open -a "Warp"

# Wait for apps to open
sleep 5

# Query monitor IDs
monitor_1=$(yabai -m query --displays | jq -r '.[] | select(.index==1).id')
monitor_2=$(yabai -m query --displays | jq -r '.[] | select(.index==2).id')

# Create spaces if they don’t exist
total_spaces=$(yabai -m query --spaces | jq 'length')
if [ "$total_spaces" -lt 3 ]; then
    yabai -m space --create
    yabai -m space --create
fi

# Assign Spaces to monitors
yabai -m space 1 --display "$monitor_1"
yabai -m space 2 --display "$monitor_2"
yabai -m space 3 --display "$monitor_2"

# Move Chrome to Space 2 on Monitor 2
yabai -m window --focus "$(yabai -m query --windows | jq -r '.[] | select(.app=="Google Chrome") | .id')"
yabai -m window --space 2

# Move Slack to Space 2 on Monitor 2
yabai -m window --focus "$(yabai -m query --windows | jq -r '.[] | select(.app=="Slack") | .id')"
yabai -m window --space 2

# Move Warp to Space 3 on Monitor 2
yabai -m window --focus "$(yabai -m query --windows | jq -r '.[] | select(.app=="Warp") | .id')"
yabai -m window --space 3

# Move Todoist to Space 1 on Monitor 1
yabai -m window --focus "$(yabai -m query --windows | jq -r '.[] | select(.app=="Todoist") | .id')"
yabai -m window --space 1

# Move Linear to Space 1 on Monitor 1
yabai -m window --focus "$(yabai -m query --windows | jq -r '.[] | select(.app=="Linear") | .id')"
yabai -m window --space 1

# Set layouts for each space
yabai -m space 1 --layout bsp
yabai -m space 2 --layout bsp
yabai -m space 3 --layout bsp
```

## Ending the day

The flip side of starting strong is finishing clean. At the end of the day, I close everything down, leaving a blank
slate for tomorrow—like clearing a desk before you leave.

Here’s my script for that:

```sh
#!/bin/bash

TERMINAL_APP_NAME="Warp"

ALL_WINDOWS=$(yabai -m query --windows)

# Iterate through each window
echo "$ALL_WINDOWS" | jq -c '.[]' | while read -r WINDOW; do
    APP_NAME=$(echo "$WINDOW" | jq -r '.app')
    WINDOW_ID=$(echo "$WINDOW" | jq -r '.id')

    # Skip the terminal app explicitly
    if [ "$APP_NAME" != "$TERMINAL_APP_NAME" ]; then
        echo "Closing $APP_NAME (Window ID: $WINDOW_ID)..."
        yabai -m window "$WINDOW_ID" --close
    fi
done

echo "All applications except $TERMINAL_APP_NAME have been closed. See you tomorrow 🎉"
```

## Easy reach

Then, I call each of these scripts using a pair of custom functions that I can invoke from my terminal:

```sh
 # Start the day
function hola() {
  ~/.config/start-day.sh
}

# End the day
function adios() {
  ~/.config/end-day.sh
}
```

Automation isn’t just about saving time. It’s about removing friction from the things you know you need to do. With a
little setup, you can free up mental space for what really matters—whether that’s tackling the next big project or
making time for the people (and dogs) in your life.

New year, same me—just a bit more effortless.
