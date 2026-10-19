# ShopMaster landing page: design plan

**Subject / audience / job:** ShopMaster, an AI agent that sets up and runs an online store for African small businesses through chat. Audience: Access Bank hackathon judges (and, later, sellers). The page's one job: make the problem, the goal and the approach obvious in under two minutes, and show the product idea working instead of only describing it.

**Dial:** 7 (marketing page).

## Palette (from the world of market trade)
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F3F4EF` | ground: cool receipt paper |
| `--ink` | `#101827` | text, dark panels |
| `--alert` | `#FF6A13` | accent: the "credit alert" orange, used for money moments and CTAs only |
| `--bag-blue` | `#2242A6` | support: the Ghana-must-go bag plaid |
| `--bag-red` | `#D3263A` | support: plaid only |
| `--chat` | `#D8F5C8` | seller chat bubbles |

The plaid of the woven "Ghana-must-go" market bag is the one texture: it appears in the intro curtain and the footer band, nowhere else.

## Type
- Display: **Big Shoulders Display** 800–900, the condensed lettering of hand-painted shop signs. Hero at clamp(4.5rem, 13vw, 13rem), tight leading.
- Text: **Schibsted Grotesk** 400/600, 18px/1.55.
- Receipt / SMS only: **JetBrains Mono** (a real receipt has monospace print, so it's used only on the receipt and the credit alert).

## Layout
```
HERO     [ huge 3-line headline, left 60% ]  [ phone: live chat that builds a store ]
PROBLEM  [ statement paragraph, words light up on scroll ] [ POS receipt prints: "what it costs today" ]
GOAL     [ one sentence across the full width, giant ]
HOW      [ pinned: steps 1–5 on the left | phone screen changes per step on the right ]
APPROACH [ horizontal track of building blocks, tagged Prototype / Next / Later ]
WHY US   [ winner ticket: 1st place, $4,000 | story paragraph ]
JOIN     [ plaid band | "Open your shop" form with success state ]
```

## Signature
The hero chat. A seller types what they sell, the agent asks two questions and the store goes live inside the phone. The page later closes the same loop: an order arrives, the item is delivered, and a credit alert lands.

## Motion thesis
"Everything arrives like a message: it's typed, it's sent, it lands."
- **Focal sequence (≤1.6s):** plaid curtain lifts → headline lines rise inside masks → phone slides up → chat starts typing.
- **Set-pieces:** problem paragraph word reveal (scrub) + receipt printing (clip-path from top); goal line split by words; How it works pinned scene with label snapping; Approach horizontal scroll; Why us ticket tear-in.
- **Feedback:** buttons press to 0.97 scale, links draw an underline, form fields lift their label, submit → "Sending" → "You're on the list".
- **Reduced motion:** everything shows in its final state, no pins, no smooth scroll, chat shows the full conversation.

## Generic-default check
- Dropped a centred hero + 3 feature cards. Replaced with an asymmetric hero and a live chat.
- Dropped the stats row / count-ups. The only number is the real $4,000 win, shown as a printed ticket.
- No gradients, glow or glass. One texture, from a real object in the subject's world.
- Numbering is used only in How it works, which is a real sequence.

## Imagery
The page uses no photos: the visuals are the product itself (chat, store, order and credit alert screens), drawn in HTML. Higgsfield image generation wasn't available in the build session. If we add photography later, the style line is: documentary photo of a Lagos market trader at their stall, late-afternoon light, palette of #F3F4EF, #101827 and one #FF6A13 accent, 35mm, no writing, signs or logos anywhere, phone screens facing away from the camera.

## QA results (last run)
- Motion check: 7/7 sections animate on desktop and mobile, layout shift 0, reduced motion shows all content.
- Smoke crawl: clean at desktop and mobile sizes.
- End-to-end tests: 12/12 pass.
- Lighthouse (mobile): performance 0.85, accessibility 0.96. The one contrast flag is the problem paragraph, whose words start faded on purpose and light up as you scroll.
