---
title: "A Week in Portugal"
hook: "After a week at Google Next, I spent the following week with my teammates in Lisbon. What time is it? Where am I? Your guess is as good as mine."
slug: bom-dia
created_at: 2024-04-19T01:22:23.624571+00:00
image: /static/images/lisbon-gif.webp
---

# Bom dia, Lisbon

I can barely keep my eyes open, my tolerance for the human race is dwindling,
and the coffee is stale. Oh, and there's a screaming baby. I must be traveling.

After taking the metro, I got to the airport a few hours early. I never know how
long security will take, especially at a new destination. Humberto Delgado is an
unexpectedly pleasant experience: walk off the metro directly into the departure
hall, go through security (6 minutes), and then realize you should have taken
your time at the hotel in the morning. Or, had more pasteis...always have more
pasteis.

It sounds like I'm complaining, but I understand how fortunate I am.
Back-to-back trips for work are...taxing. I'm looking forward to a bit of R&R in
NOLA next week as the first weekend of Jazzfest kicks off.

But, I digress. One purpose of this post is to kill the one hour I have left
before boarding my flight for Philadelphia (yes, I can taste the cheesesteak
now). So, join me as a I watch the minutes tick away and recount both a bit of
travel and some exciting work we're doing around supergraph implementations at
Hasura.

## Why Portugal?

I work with a globally-distributed team in a globally-distributed company. While
our home is in San Francisco, my team is — at times — split around the globe.
One engineer recently moved from Thailand » back to South Africa » to Portugal.
Our manager is in Switzerland; as we wanted to save costs, it made the most
economic sense for us to meet in Europe...and why _not_ Portugal if that's the
case? 😎

I've been to Spain a couple of times and can hold my own in a
conversation...though, Portuguese is a different beast entirely. The good news?
I was blown away by the common knowledge of English from everyone. As much as I
try to make an effort to know a few phrases, it was practically wasted...though,
due to my appearance, I got the occasional,

> `Ola, <PORTUGUESE_WAY_OVER_MY_HEAD>`

To which I would just nod and reply,

> `Todo bem! Voce fala ingles?`.

What are you going to do?

## Supergraphs

So, why did our team meet? We have a number of properties for which we're
responsible, but one that hasn't gotten the attention it deserves lately is
[https://hasura.io/learn](https://hasura.io/learn). This is our site of
educational resources, which started primarily as a repository for learning
about GraphQL. However, as the product has grown over the years, we've started
adding more and more Hasura-specific content.

One thing that's been lacking is that this site is — in essence — a set of
static reference materials. It's not interactive, it's not highly
engaging...it's not a platform. Our work this week was to take a giant step
forward into making this a true learning platform using a supergraph
architecture.

If you've read some of my earlier posts, or are familiar with what we're doing
at Hasura, we're an instant API provider: you give us a database connection
string, we give you an API on top of it. Instantly.

However, v3 — or the Hasura Data Delivery Network (DDN) — is the evolution of
this thinking from an instant API (or even an instant API _gateway_) to a
**composable** API, allowing you to connect with and efficiently integrate data
from disparate sources.

For our platform, that ends up looking like this:

![Supergraph screenshot](/static/images/learn-supergraph-ddn.webp)

This means we can easily integrate all of our content from our CMS, wire in our
user experience (UX) database and its core business logic, and event assess and
certify a user's knowledge and progress — all from a single API and without
having to deploy and servers or lambdas to external hosts. As I look at my tin
of sardines, it makes me think: It's a backend in a can. Maybe I'll pitch that
to marketing...

## A bit of fun

Of course, no work trip is complete without a bit of fun! We first met in Athens
a couple of years back. On that trip, we intended to take a private sunset
cruise, but the fates plotted against us and the weather (forecast) made it
impossible. This time, however, we were fortunate and sailed the harbor while
sipping wine and eating cheeses — all while getting the background of the city.
Also, I drove a car — when my friend Sean joked that it would be, "Tiny, winding
village roads", I didn't realize he was serious. He was.

![Country road, take me home](/static/images/top-gear.webp)
![I'm on a boat!](/static/images/im-on-a-boat.webp)
![Group photo at dinner](/static/images/lisboa-group.webp)

All that to say, todo bem!
