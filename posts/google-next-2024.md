---
title: "Lessons Learned from Google Next 2024"
hook: "If there was a drinking game to describe the last four days of my life, it would be about the number of booths at Google Next that have 'AI' in their title. For real."
slug: google-next-2024
created_at: 2024-04-11T23:42:48.624571+00:00
image: /static/images/frank-the-tank.gif
---

# Lessons Learned from Next 2024

## What's Next?

For the past four days, I've been in sunny Las Vegas with a crack team from Hasura that spans the organization: we've engineering, sales, marketing, and advocacy all here. I'm actually writing this from Gate 36D with what can only be described as a bunch of nerds (the guy next to me is reading Vaclav Smil...and smiling about it). Our flight's been delayed until nearly 11:00 P.M. PDT (1:00 A.M. in my head) and I've only got thirty-six hours at home until I'm back at the airport and on a plane for Lisbon to meet with the rest of my team. Yes, my wife _is_ unhappy with me about it 😅

If you're not aware, Next is Google's cloud conference. All things Google Cloud Platform (GCP) are the focus as they offer sessions on exciting updates, new services, and expanded product offerings available on GCP. Additionally, anyone that's involved in cloud technologies or on the GCP Marketplace can be found there (enter the reason why I was there).

To mitigate the risk of not forgetting everything I learned over the past several days, I'm trying to transfer this from my memory into something more permanent. However, I'm also nodding off as I write it, so there's a decent chance this is just the ranting of a sleep-deprived engineer. Either way, let's jump into it.

## AI...everything

If I was a very brave soul, I'd be pitching AI startups to any VC that would listen and throw me money. However, dear reader, I am not a very brave soul. I am writing markdown in Vim while sitting in an airport, which is surely the antithesis of being courageous (read: stupid).

It wouldn't be an exaggeration to say that the overwhelming majority of booths in the expo hall at Google Next had 'AI' somewhere in either their name or tagline.
While I didn't have the chance to walk every aisle, those that I could see from our booth and from the neighboring sections were totally and emphatically swallowed up by the topic. Legal, APM, codegen, logistics — you name it, there was an AI solution for it...all with the ability to integrate with Google's suite of cloud services of course.

However, the pattern that's emerging is one that is...concerning. The layers of abstraction that exist on top of the underlying logic and fundamental aspects of AI are relatively fragile and boilerplate. Why is it that so many startups or existing-but-pivoting companies can pitch AI as either the core or a part of their product? Because they're using RAG.

Is there anything wrong with that? Of course not, but it essentially means that if you've seen or built a single LLM-based solution to a problem, you could undoubtedly then do it again for whatever shiny object you or your opportunistic associates notice.

What I can't figure out is why this upsets me so much. The more I think about it, the more I realize that it's inherently because AI is viewed as so much of a black box by people who are not familiar with the space. They're mystified by the concept and mistake it for...actual intelligence.

I remember being at a conference for education technology several years ago and a woman from Microsoft was singing the praises of using AI to "grade" mutliple choice questions for students' tests. She mistook conditional logic for the act of thinking. I wonder what Smil would say about that... 🤷‍♂️

As I re-read everything above, I realize this has become quite cynical. It shouldn't be! The tools that people are integrating into products, extending and improving UX _can_ be transformational. The word of caution to consider is that there must be _real_ value added to a product by integrating a generative AI aspect.

## Talk to people

I heard a joke from one of our sales folks yesterday. He said, "How do you tell an introverted engineer from an extroverted engineer? The extroverted engineer looks at _your_ shoes when he's talking to you."

Some stereotypes around engineering personalities exist for a reason. And, to say that the ability to talk to and engage with other people is a superpower within engineering circles would be an understatement. Simply talking to people who show a curiosity or interest in your work — and reciprocating that curiosity towards them — and engaging with them can lead to some transformational outcomes. You never know who you're going to meet or end up next to at the airport bar (maybe you should drink, too 🤷‍♂️).

## Maybe don't take the red-eye

If there's one more word of wisdom — or at the very least insight — it's that taking the red-eye so that you can stick around to help break things down may not be the best idea. As much as you want to pitch in and keep an eye out for everyone else, keep an eye out for yourself, too.
