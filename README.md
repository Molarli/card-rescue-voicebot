# Card Rescue VoiceBot

An independent Thai/English browser simulation of urgent lost-card support. This is a bank-neutral student pitch prototype: it makes no calls, connects to no bank, blocks no real cards, and connects to no live agent.

The landing page uses original code-drawn product illustrations, a near-black/mint opening, five guided product-story sections, an embedded working demo, and a clearly labeled bank-partner concept.

## Try the demo

1. Open the page, choose **EN** or **ไทย**, and use **Try the simulation**.
2. Choose **Report a lost card**, type “I lost my card” / “บัตรหาย”, or tap the microphone. Select the fictional **Sage debit •••• 4821** or **Onyx debit •••• 7093**. You can also say or type “Sage” or “Onyx”.
3. Choose **Approve in demo app**. This is an on-screen simulation; no bank app opens and no personal information is needed.
4. Review the selected card and the simulated impact. Only the on-screen **Confirm block** button changes its status. Spoken or typed approval cannot block a card.
5. Optionally request a replacement and confirm delivery to the preset fictional address. The result uses fictional case **CR-DEMO-0001**. The other card stays active.
6. **Start a new conversation** resets both cards, selection, replacement state, and transcript. Changing language also starts a fresh session.

For failure, choose **Try a failed check**, select a card, then **Simulate failed verification**. Both cards remain active. Asking for an agent, stating uncertainty, or sending two unrecognized replies during the flow records simulated handoff **CR-DEMO-0002** without a new block. A handoff after a previously confirmed block preserves that block; it does not reactivate the card.

## Run locally

The published source is at the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8765`. There is no build step or package installation. Typing and scenario buttons work without speech support. Microphone recognition requires a supported browser, permission, and HTTPS or localhost. Spoken replies are off initially and can be enabled with the speaker button. Denied, unavailable, or failed voice input leaves typed input available. Fonts load from Google Fonts, with system fallbacks.

## Privacy and implementation

Use only fictional information. Never enter real PINs, OTPs, national IDs, full card numbers, account numbers, addresses, or bank credentials. Common numeric, spoken-number, email, and secret patterns are redacted before transcript rendering. This filter cannot identify every kind of private information, so it is not a production privacy control.

The app has no backend, analytics, cookies, local storage, or persistence. Conversation and card state live in page memory and are cleared on reset or reload. Browser speech recognition may send audio to the browser provider under its policies, before the app receives transcribed text. Speech synthesis and recognition use browser APIs. The bilingual dialogue is a deterministic rule/state machine, not an LLM.

## Product and pitch boundaries

- Proposed customer: each individual bank or contact center, not a public service that can block cards across banks.
- Proposed commercial assumption: free 30-day pilot, then **฿25,000/month** per bank/contact center. No payment or signup is implemented.
- The **under-2-minute** flow is a target, not measured performance.
- Earlier verification was **6/6 local logic checks**, not user testing. The expanded regression suite below is also local logic validation, not voice accuracy, user research, timing, integration, or cost-savings evidence.
- A borrowed-phone hotline is a **future bank-approved concept**. Live authentication, bank card actions, replacement delivery, security controls, and human escalation would require bank approval, integrations, and operational validation.

## Validation

```sh
node --check app.js
node --check dialogue.js
node --check voice.js
node tests/dialogue.test.cjs
```

The 37 regression checks cover both languages, two-card selection, identity and block confirmation gates, selected-card-only blocking, replacement/delivery, failed verification, cancellation, uncertainty, repeated fallback, agent handoff, reset, and synthetic secret redaction. Browser QA covers desktop and a 390px mobile layout, typed English success flow, Thai verification failure, reset, and dead fragment links. Actual microphone recognition and live bank operations are not tested.

## Publishing

This repository publishes static HTML/CSS/JavaScript from the **root of `main`** using GitHub Pages. No build step is required. Keep Pages set to the root. The repository name is retained for URL continuity; all website branding is Card Rescue VoiceBot.

Site address: `https://molarli.github.io/krungthai-card-voicebot/`. A successful source push alone does not prove deployment success; verify the Pages deployment after publishing.
