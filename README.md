# Meeting Mushroom

> Turn scattered meeting notes into a mycelium of decisions that rots without owners.

Feed a meeting transcript and let an LLM grow a mycelium of decisions, promises, and unclear action items. Each spore has an owner, deadline, and confidence level, while unassigned promises begin to rot visibly. The app renders a living fungal dashboard that makes vague accountability impossible to hide.

## Features
- Ingest meeting notes, voice transcripts, or calendar-linked recordings.
- Extract decision spores with owner, deadline, context, and confidence scores.
- Simulate mold growth for unassigned or overdue spores on a canvas network.
- Export a mycelium audit showing rotten promises, healthy commitments, and next steps.

## Stack
- Vercel AI SDK
- React
- SQLite

## Getting started
```
npm install, copy .env.example to .env, set OPENAI_API_KEY, run npm run db:migrate, then npm run dev
```

---
*Farmed 🚜 by [Appshaker](https://github.com/buberlo) — shaken into existence.*
