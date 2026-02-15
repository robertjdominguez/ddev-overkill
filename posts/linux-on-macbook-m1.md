---
title: "Linux on an M1 MacBook Air"
hook: "I thought this would be a fun experiment. I was wrong. Turns out there are few less frustrating activities in life than trying to write and run an Ansible playbook, only to realize that Linux on ARM doesn't place nice with most of your toys."
slug: linux-on-macbook-m1
created_at: 2024-12-13T10:05:00.000Z
image: https://i.giphy.com/4N5ddOOJJ7gtKTgNac.webp
---
 
# Linux on an M1 MacBook Air

## Why?

Why would anyone want to take a perfectly good Silicon MacBook and install a Linux distro on it? The better question: why wouldn't you?

Well...I can answer both of these questions. 

First, the MacBook in reference (which is what I'm typing on now) is not in what I would call "perfectly good" condition. It is, in fact, about four years old and one of the original Silicon generations of M1 MacBook Air. For the past two years or so, I've utilized a MacBook Pro M2 for my daily driver. The thing is a beast and easily handles all my low-level dev work, building over-engineered Docker images, compiling and running Go, Rust, and (like everyone else in the world) TypeScript.

But, it's also a beast in the sense of being fucking massive. It weighs in at almost 5 pounds, has a 16" screen, and is overkill for most things when I'm on the go.

**So, the problem (in a very first-world sense) was wanting something lighter to carry around and work on when in coffee shops, traveling, or (to be very honest) sitting in a brewery.** I'm about to move and didn't want to spend hard-earned money on yet another device, but also knew that any upgrades to macOS were going to devastate the already-dated architecture of this Air. And I've had a Linux-sized itch. So, win-win.

If you're not in this camp: stop reading now. Given the limitations I list below, I would unequivocally not recommend doing this! But, it sure can be fun...

## ARM vs. x86-64

Before we dive in, let's talk about chipsets. In the modern day, there are two major architectures you should be aware of:
- ARM
- x86-64

Broadly, ARM chips dominate most modern mobile devices, whereas x86-64 chips (produced by companies like AMD and Intel) are typically found in desktops, laptops, and servers. x86-64 is the architecture used by most machines manufactured by companies you know and love: Dell, Lenovo, IBM, and so on.

On the other hand, ARM chips power the vast majority of mobile devices (including iPhones and Android phones) and are also used in Apple's M-series MacBooks. These MacBooks benefit from the power efficiency of ARM architecture, making them lighter, faster, and cooler. However, this also means they’re limited to binaries designed to run on the ARM architecture.

While macOS mitigates this limitation with Rosetta 2, which emulates x86-64 binaries, Linux on ARM doesn't have as seamless a solution. This can lead to compatibility issues with software that hasn't been optimized for ARM.

## The suck

Linux and ARM can be a challenging combination. The majority of Linux machines run on x86-64 architecture, meaning they’re optimized for AMD or Intel processors. While ARM-powered devices like Raspberry Pis have gained popularity in the Linux world, the ecosystem still predominantly caters to x86-64 hardware.

This means you’ll face challenges installing and running certain software. Many packages and binaries are designed for x86-64, and while ARM-compatible versions exist, they’re not as common or as mature.

## The good

But, if you can navigate the quirks of installations and configurations, the experience can be rewarding. On the M1 MacBook Air, using zsh in the terminal, NeoVim, and Rust in watch mode is _still_ remarkably fast. Typing feels instantaneous, code snippets appear in no time, and navigating both the file system and desktop applications is seamless.

Additionally, I created an Ansible playbook to handle the installation and configuration of my go-to tools, so all I have to do is run [this script](https://github.com/robertjdominguez/ansible) and I'm off to the races!

## Try it yourself

If you’re curious, check out the [unofficial docs](https://ubuntuasahi.org/) for installation instructions. These resources guide you through installing Linux on Apple Silicon, though it’s worth noting that it’s an ongoing project with some limitations.

## Final Thoughts

Linux on an M1 MacBook Air is not for the faint of heart. If you enjoy tinkering and can tolerate occasional hiccups, it’s a fascinating experiment. But if you need reliability and seamless software support, sticking with macOS or an x86-64 Linux machine might be a better choice.
