export interface Cause {
  id: number
  title: string
  body: string
  detail: string
}

export const causes: Cause[] = [
  {
    id: 1,
    title: 'Volume Problem',
    body: 'Not reaching out to enough people. 100/day is the floor.',
    detail:
      'Most people doing 5–10 outreaches a day wonder why nothing is converting. The math is brutal: even at a 3% reply rate and a 30% close rate from replies, you need 100 touches a day to land one client per week. Volume is not optional — it is the entire game before you have a proof of concept. The market is not rejecting your offer. It has not seen your offer enough times to reject it. Until you hit that number consistently, you have no data. You are just guessing.',
  },
  {
    id: 2,
    title: 'Broken Pipeline Stage',
    body: 'Find which stage is leaking, not the whole system.',
    detail:
      'When nothing is working, the instinct is to blow up the whole system and start over. That is almost always wrong. Your pipeline has stages — outreach, reply, call booked, call showed, offer made, closed. Each one has a conversion rate. One of them is broken. Not all of them. If you are getting replies but no calls booked, that is a follow-up or CTA problem. If calls are booking but not showing, that is a confirmation sequence problem. If calls show but do not close, that is an offer problem. Diagnose the specific stage before you change anything else.',
  },
  {
    id: 3,
    title: 'Offer Has Hidden Costs',
    body: 'Find what people are seeing that you aren\'t pricing.',
    detail:
      'The price objection is almost never about the number. It is about the total perceived cost: your fee plus their time, their risk, the cost of switching from what they already have, and the cost of it not working. A $2,000/month retainer feels expensive when the prospect is calculating all of that together. The fix is to surface those costs yourself before they do. Name the risk. Show how you remove it. The offer that handles the hidden costs — time, risk, switching friction — closes faster than the cheapest offer in the room.',
  },
  {
    id: 4,
    title: 'No Proof, No Trust',
    body: 'No testimonials, no case studies, no receipts.',
    detail:
      'Trust is not built through claims — it is built through evidence. Saying you get results and showing a screenshot of a result are not the same thing. A prospect who has never heard of you needs to see something specific: a named client, a concrete number, a before and after. Generic claims like "we help businesses scale" are noise. "We helped a $400K HVAC company in Phoenix go from 12 to 41 inbound calls per month in 90 days" is a receipt. If you do not have receipts yet, your first priority is to work for free or deeply discounted to create them — not to keep pitching without them.',
  },
  {
    id: 5,
    title: 'Pitching Instead of Asking',
    body: 'ACA framework converts because it never feels like a sell.',
    detail:
      'The moment a prospect feels sold to, their defenses go up. ACA — Acknowledge, Compliment, Ask — works because it never triggers that reflex. You acknowledge something real about their situation, give a genuine compliment, and then ask a question rather than making an offer. The ask is not "are you interested in my service?" It is "do you know anyone who might benefit from this?" That shifts the dynamic entirely — you are asking for help, not making a pitch. The people who say yes to helping you often become clients themselves. The ones who refer someone else warm that person up for you.',
  },
  {
    id: 6,
    title: 'Generic Outreach',
    body: '30 seconds of personalization is the entire difference.',
    detail:
      'A message that could have been sent to ten thousand people reads like spam — even if it is technically accurate. Thirty seconds of real research changes everything: mention a post they made, a city they operate in, a client they worked with, a specific niche detail. It signals that you looked. That signal alone separates you from every other message in their inbox. Personalization is not about being clever or flattering — it is about proving you are a real person who actually saw them. That proof is worth more than any headline, hook, or call to action you could write.',
  },
  {
    id: 7,
    title: 'You Left The Work',
    body: 'Know where the bodies are buried in your pipeline.',
    detail:
      'Every pipeline has leads that went cold not because they said no, but because you stopped following up. "Let me think about it," "reach out next quarter," "my budget renews in January" — these are warm leads with a specific re-engagement date attached. Most people forget them and go back to cold outreach. Going back to a dormant list of people who were once interested is the highest-leverage activity in your pipeline. They already know who you are. The trust bar is lower. One well-timed message to a six-month-old "not right now" can close faster than a hundred new cold contacts.',
  },
  {
    id: 8,
    title: 'Truth Isn\'t Your Ally Yet',
    body: 'Own the negative, amplify the positive.',
    detail:
      'The counterintuitive move is to say what your service cannot do before the prospect asks. Acknowledging a real limitation — "this does not work well for businesses under $20K a month in revenue" — does two things: it disqualifies bad fits early, and it makes every other claim you make more credible. Prospects expect salespeople to oversell. The moment you undersell one thing, they believe you more on everything else. This is not humility for its own sake — it is a trust-building mechanism. Own the constraint, then show why it does not apply to them, and you have already won more credibility than most people earn in an entire sales call.',
  },
]
