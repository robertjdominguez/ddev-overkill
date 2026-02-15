---
title: "Recursion: Your Code's Dungeon Crawler"
hook: "Recursion can be intimidating, but with the right approach, it's like uncovering a maze, one room at a time. In this post, I break down recursion step by step, using a dungeon crawler analogy to guide you through it."
slug: recursion-on-recursion
created_at: 2024-10-24T14:00:00.000Z
image: /static/images/recursion.webp
---

# Recursion: Your Code's Dungeon Crawler

Imagine you're dropped into the entrance of a vast maze. It’s not just any maze—it’s the kind of maze that has rooms within rooms,
some with doors leading to even deeper parts, and each room has hidden treasures (or in our case, data) that you need to collect.
You can't see the whole maze at once, so you explore room by room, marking doors you've already opened and mapping your path as you go.

This, my friend, is recursion. And, if you're like me, you’re probably already imagining the hero gearing up for a quest,
navigating rooms (or nested data structures) one by one.

I recently published an npm package that takes Docusaurus sites and turns them into PDFs. While there were other
existing packages out there, we weren't getting the results we wanted. I played around with a lot of different
implementations before realizing that recursion would be my friend and make the core of this application incredibly
simple. One problem: before this, I hated recursion.

In this package, our function `scrapeSidebar` is a lot like a hero navigating a maze—each webpage is a room,
and every time we hit a door (subdirectory), we need to recursively explore what's behind it. In this post, we’ll walk through
the quest step by step.

## The Hero's Mission

Our quest is to scrape a website's sidebar—grabbing links from rooms (webpages) that could contain hidden doors leading to more rooms.
Recursion is our hero’s tool for this: it lets us handle the nested structure of the sidebar, where one directory could lead to a deeper
level of pages, each with its own sub-items.

Here’s the hero’s initial weapon—our `scrapeSidebar` function:

```ts
export async function scrapeSidebar(
  aUrl: string,
  baseUrl: string,
  requiredDirs?: string[],
  localProcessedUrls = new Set<string>(),
): Promise<SidebarObject[]> {
```

Before we jump into the maze, let's break down our game plan. We have a starting URL (`aUrl`)—that’s the entrance. The `baseUrl` will
help us construct full paths as we move deeper into subdirectories. We also have a **map** in the form of `localProcessedUrls`,
which tracks which rooms (or URLs) we've already visited. This helps us avoid going in circles and hitting the same rooms over and
over (because nobody wants to be stuck in an infinite loop).

### Step 1: Entering the First Room

The first task for our hero is to step into the entrance of the maze and check the surroundings—aka, fetch the HTML of the page.

```ts
const html = await fetchHtml(aUrl);
```

This is like entering the first room and checking out all the doors (links) we can explore.

Next, we search for the sidebar, the place where all our possible doors are listed:

```ts
const sidebarData = findSidebar(html);
```

This function searches the room (the webpage) to see if there are any doors at all. If there aren’t, our hero heads back and reports
that this particular path was a dead end. But if there are, it’s time to make note of them and prepare for the next move.

### Step 2: Mapping the First Room

After finding the sidebar, we make our first pass over the items—like looking at all the doors and deciding which ones are worth opening.
We create a `SidebarObject` for each item and mark the URL as processed:

```ts
let sidebarElements = sidebarData.toArray();
sidebarElements = filterSidebarElements(sidebarElements, requiredDirs ?? []);
```

For each door (sidebar item), we check where it leads. Is it a regular door to another room, or a special one leading to a whole new
section of the maze (a sublist)?

```ts
const hasClass = $(item).hasClass("menu__link--sublist");
let newItem = createSidebarObject(item);
```

If it's just a regular door, we can make a note of it and continue. But if it’s a **sublist**, we prepare to recursively explore that
deeper section. We push all these items (doors) into our array `sidebarObjectArray` to keep track of what we’ve encountered in this room.

### Step 3: Opening Doors and Entering Subdirectories (Recursion)

Once we’ve mapped the room, it’s time to start opening the doors. For each item that represents a **sublist** (a door leading to
another section), we need to open it and head deeper into the maze. Here’s where recursion—the ability for the hero to call on
themselves to explore further—comes in:

```ts
for (let newItem of sidebarObjectArray) {
  if (newItem.subItems && typeof newItem.canonicalLink === "string") {
    const subItems = await scrapeSidebar(
      `${baseUrl}${newItem.canonicalLink}`,
      baseUrl,
      requiredDirs,
      localProcessedUrls,
    );
    newItem.subItems = subItems;
  }
}
```

This is our hero stepping through the door and finding yet another room, with its own set of doors! They call on themselves (recursion)
to explore this new room, repeating the process of marking URLs, mapping sidebar items, and, if necessary, diving deeper into more
subdirectories.

Each recursive call pushes the hero deeper into the maze, handling each new room independently until there are no more rooms to explore.

### Step 4: Returning to the Surface

Once the hero reaches a room where there are no further doors to explore (no more sub-items or URLs), the recursion stops. The function
returns the results back up to the previous level, completing the loop, and the hero gradually retraces their steps to the surface.

```ts
return sidebarObjectArray;
```

Each recursive function call wraps up its work and sends the data back up the chain, combining the treasures (data) from all the
subdirectories. Once the hero is back at the starting point, we have a fully processed sidebar, with every nested link (and sublink)
mapped out.

## The Power of Recursion: A Hero’s Best Tool

Why is recursion so useful for this quest-like scenario? Without recursion, the code would need some sort of complex loop structure,
like a stack or queue, to keep track of all the nested links. This would quickly become a tangled mess—just like trying to map out a
maze on your own without a compass.

Recursion simplifies the process by breaking down each room (or sidebar) into manageable pieces. Each room is handled independently,
but the recursive calls ensure that every room is accounted for, no matter how deep into the maze we go. The result is clean,
maintainable code that handles even the most labyrinthine website sidebars.

## Recursion's Base Case: The Exit

Of course, every quest has to end somewhere, and that’s where recursion's **base case** comes in. In our maze, the base case is simple:
when we hit a room (or webpage) without any more doors to open, we stop. We don’t want our hero endlessly wandering a maze with no way
out!

That’s where tracking the processed URLs comes in handy, like leaving breadcrumbs in a maze. It prevents us from looping back into
rooms we’ve already visited:

```ts
if (localProcessedUrls.has(normalizedUrl)) {
  continue;
}
```

By checking if the URL has been processed, we avoid infinite loops and keep our hero on the right track.

## Final Thoughts: Every Maze is Conquerable

Recursion may sound daunting at first—like a quest into an unknown labyrinth—but once you understand its power, it becomes one of the
most elegant solutions for handling complex, nested structures. In the case of our sidebar scraping, recursion allows us to
systematically explore every corner of the site without duplicating effort or getting lost in the weeds.

So, next time you’re faced with a nested structure, think of recursion like your hero's secret weapon. It’s there to help you navigate
every twist and turn of the maze, making sure no room—or data—goes unexplored.

Stay lazy, keep questing!

PS — you can check out the package for yourself [here](https://www.npmjs.com/package/docusaurus-to-pdf)!
