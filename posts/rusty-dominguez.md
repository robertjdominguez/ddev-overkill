---
title: "A Bit Rusty"
hook: "A few weeks ago, I embarked on a journey to learn Rust. Am I done? Of course not! However, I'm dangerously literate...and a able to write at least this site 🎉"
slug: rusty-dominguez
created_at: 2024-04-03T17:27:48.624571+00:00
image: https://i.giphy.com/uA8WItRYSRkfm.webp
---

# A Bit Rusty

It's been a long two months! While I'm disappointed I didn't keep my WILT streak going, I've been busy learning a few
new things. Notably, I've kicked off a twelve-week long excursion into learning Rust. This is my second time jumping
into the language, but the first time I've felt any bit comfortable taking it for a spin.

## Motivations

At Hasura, we re-wrote the core of our engine in Rust. I shouldn't say "we" as my Rust-based contributions have been —
to date — focused on updating interpolated string values 😅

But, I wanted to be in the position that I could (a) understand the codebase and (b) contribute if the situation
presents itself. I'm happy to say that I can check the first item off my list in that I can quickly read through a Rust
file and make heads and tails of what's going on.

I did this by focusing my efforts on migrating from TypeScript to Rust and using services I've already built in
TypeScript as my stepping stones. Then, I worked through how they would be constructed in Rust. Notably, this site —
found in this [repo](https://github.com/robertjdominguez/ddev-rust-server) — is the biggest step in that direction.

## Lessons learned

I remember the first time I saw Rust about a year ago. I looked at it and thought, "What the hell does this say?" I then
foolishly made a small utility that wrote nginx redirects for me using our Algolia index. And, I thought that was great.
Now, I look back at that code and shutter (but, hey — it still works!).

Regardless, the biggest obstacles to overcome in learning Rust were undoubtedly around the following concepts:

### Borrow Checker

If you've looked into Rust, you've probably heard horror stories of this. You shouldn't worry! The first eye-opening
lesson for me in relation to Rust was that the compiler is your friend! The rust-analyzer working under the hood has
excellent error messaging and helps you to diagnose your issues before you compile your code. How does this translate to
the borrow checker? Easy: Rust has strict ownership rules that govern how values are used; this makes it an incredibly
efficient language with respect to memory. There's no overuse or copying of values _references_ to them can be used
instead! Let's take a look at this example:

```rust

fn main() {
    let rust = "Rust programming".to_string();
    let borrow_checker = &rust; // Borrowing occurs here

    println!("I love {}!", rust); // Rust's borrow checker: "Can't do that! I'm still using it!"
    println!("Said the borrow checker: 'Did you really think I'd let you modify {} while it's borrowed?'", borrow_checker);
}
```

Pretty cool, eh?

### Pattern Matching

Rust, not much unlike a therapist, forces you to deal with your errors first. For sitautions where a function could
return different types, `<Option>` is used. Often, this means dealing with return values that could be something like
`Error` or a more common primitive or user-defined type such as `String` or `BigIdea`. The great thing? Once you've deal
with any potential errors, you can confidently write your type-checked code and continue on confident 💩 won't break.

Let's take a look at an example:

```rust
use std::fs;

fn read_file_to_string_with_humor(file_path: &str) -> Option<String> {
    match fs::read_to_string(file_path) {
        Ok(contents) => Some(contents),
        Err(_) => None,
    }
}

fn main() {
    let file_path = "example.txt";

    match read_file_to_string_with_humor(file_path) {
        Some(contents) => println!("File contents: \n{}", contents),
        None => println!("The file has vanished into thin air! Was it ever real to begin with?"),
    }
}
```

## I made this more difficult than it should have been

There are plenty of frameworks out there for serving content, even templated content at that. It's been nearly a decade
since I used something like Handlebars for serving dynamic content within HTML templates, and I didn't want to go back
to it. So, this whole site is compiled using built-in macros for string interpolation instead 🤷‍♂️

## Next steps

I've got a few weeks left in my Rust journey. I'm quickly understanding why it was SO's most-loved language from
2016-2023! While it takes some getting used to, the amazing speed at which programs run and the confidence one gets from
writing panic-safe code is a pretty great feeling.
