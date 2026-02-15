---
title: "I Can't Quit You: Streamlining Tasks with Neovim"
hook: "It's a cheesy, tired joke about not being able to quit Vim. But, I just love this gif so much — it seemed right."
slug: i-cant-quit-you
created_at: 2024-05-05T14:52:23.624571+00:00
image: /static/images/i-cant-quit-you.webp
---

# I Can't Quit You: Streamlining Tasks with Neovim

## Background

Yep. I'm one of _those_ people now. Well, I guess to many I'd still be considered a bit of an imposter when it comes to
Vim. I do — matter of factly — use Neovim and, at that, the LazyVim distribution. But, laziness is quite on-brand for
anyone that's read this blog.

In conjunction with some other learning endeavors over the past several months, I also set down a path of trying to
learn Vim motions and — eventually — adopt the editor. I want to say I started this around January and took quite a long
break but, now, I'm surprised to say that I've fully made the switch. Why? Efficiency gains. Were those immediate?
Absolutely. Not.

However, once one gets over the proverbial hump, one will wonder how they ever used a mouse or clicked their way through
their IDE when all the power you need — and then some — is right at your fingertips (and completely customizable).

## Vim's learning curve

It's true: Vim has a sharp learning curve. But, the dominoes start to fall rather quickly when you take into
consideration first learning the modes and then the motions. Do I still button-mash like I'm 8-years-old playing Street Fighter in the
now extinct New York Pizza in my home neighborhood? At times, yes.

However, more often then not I find my muscle memory kicking in and my ability to move from file to file and operation
to operation alarmingly efficient.

## Plugin ecosystem

One reason for this is the extensibility of Vim and its motions and conventions that can easily be added into one's
configuration using plugins. There are plugins for _everything_ making the need for ever exiting your terminal — or even
editor — almost needless. Yes, there's one for Slack...but I haven't gone _that_ far. Yet.

I try to keep things organized and — for the past two years — I've used Notion, among other note-taking tools. The
interface is lovely, the UX is delightful, and the ease of sharing notes is first-class. However, I was looking for a
way to reinforce my exposure to Vim through everyday tools. We'll call this a "saturation and exposure" model for
learning 🤷‍♂️

As I take a lot of notes and work in Markdown most of the day, I figured Obsidian would be quick to adopt since it has a
[Neovim plugin](https://github.com/epwalsh/obsidian.nvim) _and_ a migration tool for bringing notes out of Notion and into an Obsidian vault (their term for a
project, notebook, what-have-you).

The plugin is fantastic and offers a number of commands and shortcuts to empower you to quickly and efficiently create,
search, move through, and explore your notes. It even offers a template option. This is where my hamster started to
spin...I'm in the same meetings each week and — within Notion — I'd created a series of templates that I would copy and
paste (typically as rows in tables) and take notes anew each week. But, seeing as how I knew I was all-in on Vim, I
figured I could _really_ take things a step further and practically automate the generation of a new note, specific to
the meeting at hand, using Vim motions and a scripting language called Lua.

## Lua scripts

You can read more about [Lua here](https://www.lua.org/about.html), but essentially it's the language that's used to
configure and extend the functionality of Neovim. Depending on the role of script or configuration, I have a series of
Lua files in my dotfiles for Neovim that allow me to bring in plugins or add my own custom scripting.

In the case of my desire to make the essential things easy, the latter is the direction I took here.

The Obsidian plugin already contained several commands that could create a new note:

```plaintext
:ObsidianNew <filename>
```

Or, once inside a note, drop in a template:

```plaintext
:ObsidianTemplate <template_name>
```

The first note I wanted to automate is the one that I guarantee I'm prepared for each week: my one-on-one with my
manager, Marion.

So, within the `/templates` directory of my vault, I created the following:

```Markdown
# One-on-one for: {{date}}

## Items to discuss

| Topic | Details | Status |
| ----- | ------- | ------ |

## Marion's notes
```

Is it wildly exciting? Nope. But, it's not supposed to be — it's simply the starting place that I give myself each week
when I sit down to think about anything I'll need to discuss with her. Also, the Obsidian plugin can read
handlebars-like notation to dynamically drop in values, like `{{date}}`.

And, as we'll see, I can generate this in three keystrokes when I open my notes folder in Neovim 😱

Next, in my `~/.config/nvim/lua` directory, I created the following function to create a new note using the Obsidian
plugin's commands and drop in my newly-created template from above:

```lua
local function new_one_on_one_meeting_note()
  -- Get today's date in YYYYMMDD format
  local date = os.date("%Y%m%d")
  local filename = "Meetings/Marion/marion-" .. date .. ".md"

  -- Run :ObsidianNew command with the filename
  vim.cmd("ObsidianNew " .. filename)

  -- Remove the first occurrence of a line starting with #
  vim.schedule(function()
    local bufnr = vim.api.nvim_get_current_buf()
    local lines = vim.api.nvim_buf_get_lines(bufnr, 0, -1, false)
    for i, line in ipairs(lines) do
      if line:match("^#") then
        vim.api.nvim_buf_set_lines(bufnr, i - 1, i, false, {})
        break
      end
    end
  end)

  -- After the file is created, run the :ObsidianTemplate command with a specific template
  vim.cmd("ObsidianTemplate marion-one-on-one.mdx")
end

  -- Make the function globally accessible if necessary
_G.new_one_on_one_meeting_note = new_one_on_one_meeting_note

```

I had to do a few special things (like remove the `<h1>` heading that was present when the new note is generated by the
plugin and make the function globally available), but overall this was pretty straightforward!

## Keymapping to your ❤️'s content

Then, I can map a set of keys triggered by hitting my `leader` (the spacebar) and initiate the script:

```lua
-- Map the function to a key combination, e.g., <leader>oo
vim.api.nvim_set_keymap("n", "<leader>oo", ":lua new_one_on_one_meeting_note()<CR>", { noremap = true, silent = true })
```

In this case, all I have to type is the spacebar followed by `oo` and I've got my one-on-one note ready-to-go for the
day.

All in all, it looks like this:

![Script in action](/static/images/leader-o-o.webp)

Of course, I've expanded this to all different note-taking formats I use for various meetings (team, P&E weekly sync,
all-hands, office hours, etc.). But, it's not just limited to notes: with this kind of scripting, I can
automate...nearly any editor-related task 🚀

Yes, we have lots of meetings.
