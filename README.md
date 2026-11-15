# ELDERLY360

**Proactive elderly care continuity: noticing when care quietly slips.**

🔗 **Live Demo:** https://elderly360-nine.vercel.app
💻 **GitHub:** https://github.com/Rinki781/Elderly360
🏆 Built in 7 hours for the **Makers Need More (MnM)** hackathon.

> Open the live demo and click any role under **Judging Demo Mode**. No signup is needed.

---

## Problem Statement

<paste the exact problem statement you chose here>

Most elderly-care apps only send reminders. Nobody notices when care slowly breaks down: evening doses get skipped, walks are missed, and check-ins fade. Families usually find out only after an emergency.

## Our Solution

ELDERLY360 connects **seniors, family members and caretakers** in one ecosystem, with a **Care Intelligence** layer that detects problems early:

- **Care Continuity Score (0-100):** an explainable score that says *why* it changed, in plain language.
- **Routine Drift Detection:** compares the last 7 days with the previous 21-day baseline for each activity and time slot.
- **Smart Escalation Ladder:** missed dose → senior reminder → caretaker alert → family alert → SOS.
- **Senior-controlled privacy:** the senior decides what each family member can see.

## Screenshots

| Dashboard | Care Continuity Score |
|---|---|
| ![Dashboard](docs/dashboard.png) | ![Score](docs/score.png) |

| Routine Drift | Care Passport |
|---|---|
| ![Drift](docs/drift.png) | ![Passport](docs/passport.png) |

## Key Features

| Area | Features |
|---|---|
| Medication | Schedules, taken/skip/snooze, adherence history, refill prediction |
| Care tasks | Daily tasks assigned to the senior or caretaker, vitals logging |
| Care Intelligence | Explainable Continuity Score, 30-day trend, drift cards, escalation timeline |
| Privacy and consent | Per-family-member visibility controls |
| Accessibility | Simplified Senior Mode, large buttons, Hindi/English voice assistant |
| Emergency | One-tap SOS, emergency contacts, Care Passport QR |
| Healthcare ecosystem | Nearby doctors and hospitals on an OpenStreetMap map, appointments |
| Digital Care Passport | Conditions, allergies, medicines, records, emergency contacts |
| AI | Gemini-powered doctor-visit summary |
| Roles | Senior, Family and Caretaker views with a role switcher |

## How the Care Continuity Score Works

| Factor | Weight |
|---|---|
| Medicine adherence | 50% |
| Daily care tasks and vitals | 25% |
| Doctor appointment attendance | 15% |
| Check-in consistency | 10% |

Recent days count more. Drift is flagged when an activity's completion over the last 7 days drops significantly against its 21-day baseline.

## Architecture

```mermaid
flowchart TD
    U[Senior / Family / Caretaker] --> UI[Next.js App Router UI]
    UI --> CTX[Shared state context]
    CTX --> CI[Care Intelligence engine<br/>score + drift + escalation]
    CTX --> SEED[Seeded 30-day demo data]
    UI --> API[/api/gemini route/]
    API --> G[Gemini API]
    UI --> MAP[OpenStreetMap map]
    UI --> VOICE[Web Speech API<br/>Hindi + English]
```

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini, called from a server-side API route
- **Maps:** OpenStreetMap
- **Voice:** Web Speech API (hi-IN, en-IN)
- **Deployment:** Vercel

## Run Locally

```bash
git clone https://github.com/Rinki781/Elderly360.git
cd Elderly360
npm install
cp .env.example .env.local
# add your GEMINI_API_KEY to .env.local
npm run dev
```

Open `http://localhost:3000`.

### Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini-powered doctor-visit summary. A template summary is used if it is missing. |
| `NEXT_PUBLIC_FIREBASE_*` | Optional. A local fallback is used when these are empty. |

## Demo Walkthrough (for judges)

1. Open https://elderly360-nine.vercel.app and click a role under **Judging Demo Mode**.
2. Use **View As** to switch between Senior (Ramesh), Family (Aarav) and Caretaker (Priya).
3. Open **Care Score (30d)** to see the explainable score and the recent slip.
4. Open **Routine Drift** to see the evening-dose drift cards.
5. Press **Simulate Time** to advance the demo clock and watch the **Escalation Ladder** progress.
6. Open **Privacy & Consent** to control what family members can see.
7. Try **Senior Mode**, the **Voice Assistant**, **Emergency SOS**, **Care Passport (QR)**, **Doctor Visits & AI Brief** and **Nearby Doctors & Maps**.

The demo uses 30 days of seeded data for Ramesh Sharma (72), with a deliberate drop in evening adherence over the last 6 days.

## Project Structure

```
app/          Next.js pages, layout and the Gemini API route
components/   Feature components (dashboard, medication, drift, SOS, passport, ...)
context/      Shared application state
lib/          Care intelligence engine and seed data
types/        TypeScript types
```

## Known Limitations

- Demo data is seeded and stored on the client, so it is not synced across devices.
- Doctor and hospital listings are sample data for the demo.
- Escalation is simulated and does not send real SMS or WhatsApp messages.
- ELDERLY360 supports care coordination and is **not a substitute for professional medical advice**.

## Roadmap

- Cloud database and authentication so invite codes work across devices
- Real SMS and WhatsApp notifications
- Wearable and device integration
- More Indian languages
- ABDM (Ayushman Bharat Digital Mission) integration

## License

MIT