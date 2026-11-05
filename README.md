# FRND FOBIA — Viral Gen-Z Social Gaming Platform

**FRND FOBIA** is a viral, mobile-first social quiz website built with modern Y2K internet meme aesthetics, bold typography, and original cartoon-style mascots. Users create savage 5-question friendship challenges, share unique links across WhatsApp, Instagram Stories, and group chats, and track friend submissions in real-time on a Creator Dashboard.

---

## 🎨 Brand Identity & Y2K Visual Aesthetics

- **Brand Name**: FRND FOBIA
- **Tagline**: *"How well do your friends REALLY know you?"*
- **Visual Design**: High-contrast Y2K internet culture with neo-brutalist styling, comic stickers, speech bubbles, and tactile responsive controls.
- **Color Palette**:
  - **Electric Neon Lime** (`#CCFF00`)
  - **Hot Pink** (`#FF1493`)
  - **Cobalt Blue** (`#1D4ED8` / `#2563EB`)
  - **Deep Black** (`#080808` / `#0A0A0A`)
  - **Clean White** (`#FFFFFF`)

### The 4 Official Brand Mascots
1. **Suspicious Bestie**: The Chief Inspector with magnifying glass and hilarious side-eye (*"Wait... who actually are you? 👀"*).
2. **Drama Queen**: Hype royalty with crown and dramatic gasp (*"I am literally crying screaming throwing up 👑😭"*).
3. **The Savage**: Impish receipt collector with devil horns and red flags (*"I came with receipts and zero mercy 😈"*).
4. **The Chill One**: Laid-back icon with Y2K shades and iced boba (*"It's not that deep bro, you're locked in 🧋😎"*).

---

## 🚀 Key Features

1. **Step-by-Step Challenge Creation**:
   - 60-second creation flow with zero mandatory registration.
   - Creator nickname entry + mascot auditor assignment.
   - 18+ rich Gen-Z questions (red flags, toxic traits, 2 AM habits, comfort meals) plus custom question and custom answer creator.
   - Secret answer selection (exactly 1 answer chosen per question).
   - Challenge lifespan toggle: 24 Hours (default flash rush) or 48 Hours (weekend test).
   - Instant shareable link generation with WhatsApp 1-tap sharing, Web Share API, and clipboard copy.

2. **Mobile-First Friend Quiz Experience**:
   - Personalized landing: *"Can you survive [Creator]'s test?"*
   - Nickname entry with duplicate/spam protection.
   - 5 questions rendered one-by-one with smooth transitions, progress indicator, tactile answer buttons (≥ 48px hitboxes), and Back/Next controls.
   - **Zero Client-Side Answer Exposure**: Correct answers are never sent to the browser ahead of time.

3. **Animated Results & Story Graphic Generator**:
   - Score reveal out of 5 and accuracy percentage.
   - Result categories matched with mascot reactions:
     - 0–1: *"ARE YOU EVEN FRIENDS? 💀"* (The Savage roast)
     - 2–3: *"FRIENDSHIP UNDER INVESTIGATION 👀"* (Suspicious Bestie audit)
     - 4: *"OKAY, YOU ACTUALLY KNOW THEM! 💅"* (Drama Queen hype)
     - 5: *"BESTIE MATERIAL. LEGENDARY! 🏆"* (The Chill One soulmate stamp)
   - **High-Res (1080×1920) 9:16 Story Card Generator**: Draws directly to HTML5 Canvas in Y2K neon lime & hot pink for Instagram Stories and WhatsApp Status with 1-tap PNG download.
   - **Viral Loop Engine**: Prominent CTA *"NOW IT'S YOUR TURN. EXPOSE YOUR FRIENDS!"* encouraging participants to challenge back.

4. **Live Creator Dashboard**:
   - Real-time scoreboard with total attempts, group average score, and highest record.
   - Full participant leaderboard with friend nicknames, percentage scores, and timestamps.
   - Challenge countdown timer showing time left until expiration.

5. **Monetization & AdSense Readiness**:
   - Reserved clean advertisement areas on homepage (728×90 leaderboard) and results page (300×250/responsive).
   - Ad containers stay hidden until active Google AdSense scripts are injected.

---

## 🔒 Security & Database Architecture

- **Firebase Firestore Database**: Provisioned on `meta-boulder-whl8x` with dedicated database ID `ai-studio-frndfobia-5b83db68-80e2-4a5a-bd0b-c20481e7785f`.
- **Zero-Trust Answer Storage**: Public metadata is saved under `/challenges/{id}`, while answer keys reside in `/challenges/{id}/secret/answers` with **zero public read permission** enforced in `firestore.rules`.
- **Server-Side Scoring**: Scored securely via Express backend (`server.ts`) or Firebase Cloud Functions (`/functions`).

---

## 🛠️ Local Development & Deployment

### Run Locally:
```bash
npm install
npm run dev
```
App runs at `http://localhost:3000`.

### Deploying Firestore Security Rules:
```bash
firebase deploy --only firestore:rules
```

### Deploying Firebase Cloud Functions:
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```
*(Requires Firebase Blaze plan for Cloud Functions deployment).*

### Netlify Deployment:
1. Connect repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add `_redirects` file with `/* /index.html 200`.
