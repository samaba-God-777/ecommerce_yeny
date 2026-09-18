---
name: Yenyleths Store
description: Industrial Streetwear — the boutique as a garment rack on the sales floor.
colors:
  primary: "#f04e1a"
  primary-deep: "#c63d10"
  neutral-bg: "#f6f4ef"
  neutral-elevated: "#fbfaf6"
  neutral-ink: "#14120f"
  neutral-ink-soft: "#5a554c"
  neutral-line: "#d9d4c6"
  neutral-line-strong: "#a8a294"
typography:
  display:
    fontFamily: "Barlow Condensed, Archivo, sans-serif"
    fontSize: "clamp(4rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Barlow Condensed, Archivo, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.18em"
rounded:
  sm: "0px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-elevated}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.neutral-ink}"
    textColor: "{colors.neutral-elevated}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
    typography: "{typography.label}"
  button-price:
    backgroundColor: "{colors.neutral-elevated}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.sm}"
    padding: "2px 10px"
    typography: "{typography.label}"
---

# Design System: Yenyleths Store

## Overview

**Creative North Star: "The Sales Floor Stockroom"**

Yenyleths presents itself not as a boutique vitrine but as the garment rack inside the shop — every piece hangs with its tag still on, and the story of the store is told in the honest language of a stockroom. This is a deliberate refusal of both the cream-shelf luxury boutique (warm serif display, muted gold, generous rounded goods) and the dark neon tech shop (near-black with glowing accents). Instead the world is built from white cotton, black nylon, candy-painted chrome, and the safety-orange hanging tag: industrial, kinetic, and unmistakably of the working Panamanian street.

The system treats wayfinding as reading. Zones are not navigated by icons but named with their literal labels inside straight quotation marks — "Categorías", "Nuevos ingresos", "Su pedido" — and the visitor reads the floor like a shelf. Structure arrives as hard 2px ink rules and repeating 45-degree black-on-white hazard diagonals that strike through any piece that is off the rack (a discount, a flash sale, an out-of-stock item). The single accent color is the zip-tie tag: safety orange, reserved for certainty — the price, the day's remate, the live call-to-action — and kept rare so its trust stays rare. Depth is flat and tonal; the world has no soft shadows at rest, only the hard printed edge of a ruler line or the natural swing of a hanging tag.

**Key Characteristics:**
- Square geometry throughout — zero rounding; borders are hard, ruler-straight 2px ink lines.
- One accent, "safety orange", carries every certainty signal and stays a small share of any screen.
- Quotation-marked labels replace icons; the interface is read, not decoded.
- Hazard diagonals (45°) are the world's alarm/alert grammar, used for sale, remate, and stock edges.
- Type is heavy industrial — condensed caps for display, grotesk for body, mono for tags and price tickets.

## Colors

The palette is restrained: two neutrals (white cotton, black nylon) plus a single saturated accent. There is no secondary or tertiary hue — orange is the only chroma in the system.

### Primary
- **Safety Orange Zip-Tie** (#f04e1a): the hanging tag. Carries the price ticket, the day's remate band, the primary action, the live cart badge, and the "Quiero esta pieza" plate. Struck through with hazard only where it announces a deal.
- **Safety Orange Deep** (#c63d10): hover/pressed state of the primary tag and secondary emphasis inside orange regions.

### Neutral
- **Black Nylon** (#14120f): the inks and ground of dark chrome — hero ground, footer, the frame around product imagery, hard rules, primary/current nav, swing tags.
- **White Cotton** / elevated (#fbfaf6, ground #f6f4ef): the standing surface the catalog sits on; anything a customer touches or reads at rest sits on cotton.
- **Muted Ink** (#5a554c): secondary body copy, labels, metadata — never pure gray, always toned toward the warm cotton ground.
- **Hazard / Border** (#d9d4c6 rest, #a8a294 strong): the 2px lines and dividers; hairline structure that yields to ink when something must.

### Named Rules
**The One Tag Rule.** Safety orange appears on at most a small fraction of any screen and only where the store is certain — the price, the action, the live countdown. Its rarity is what makes it read as a guarantee; spraying it across cards would flatten it into a theme.

**The No-Cream Rule.** No warm serif display, no gold, no muted-chic boutique neutral. When that look is reached for, the world has left the sales floor.

## Typography

**Display Font:** Barlow Condensed (with Archivo fallback)
**Body Font:** Archivo (system-ui fallback)
**Label/Mono Font:** Archivo Mono (ui-monospace fallback)

**Character:** Display is a heavy condensed industrial caps — set in straight-quoted labels and tall hero headlines, it reads like stenciled crate lettering. Body is a compact working grotesk. Labels and prices are mono, read as the paper tickets pinned to each piece.

### Hierarchy
- **Display** (Barlow Condensed, 700, `clamp(4rem,8vw,6rem)`, 0.95): hero headlines only — set uppercase, tight leading, no more than a few words.
- **Title** (Barlow Condensed, 700, `clamp(1.5rem,4vw,2.25rem)`, 1.0): section headings, always uppercase, with the ink 2px underline.
- **Body** (Archivo, 400, ~0.9375rem, 1.6): product copy, descriptions; measure kept ~65–75ch in paragraphs.
- **Label** (Archivo Mono, 700, ~0.6875rem, letterspaced 0.18em, uppercase): tags, rack names, metadata, buttons, downstream kicks.

### Named Rules
**The Quote Rule.** Every zone and key label is wrapped in straight quotation marks and set in display caps. If it reads as a whispered label it has broken character; it must read as a printed sign.

## Layout

A single centered container (max-w-7xl, px-4 / lg:px-8) holds the catalog. Sections are separated end-to-end with hard 2px horizontal ink rules, one per content block. Headings sit above their content with the underline at the heading's base — more space above a heading than below it. Products and categories sit in responsive grids that collapse from four columns (desktop) to two (mobile) without changing the card's anatomy. The Instagram "rail" is a flex row of equal strips that open on hover (the accordion garment rail); on mobile it becomes a simple three-column grid, preserving the appliance without hover.

## Elevation & Depth

This system is tonally flat. There are no soft, offset drop shadows as the default depth language; depth is carried by hard line-weight contrast (a 2px ink border against cotton) and by the printed plate/stamp feel of surfaces. The only sanctioned shadows are natural material ones — the hanging swing tag's drop against a picture, and the small drop under the hero tag — never a repeated ambient shadow on every card.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest and read through 2px ink rules, not blur or elevation. A soft ambient shadow appears only as a state response (a tag in motion, an elevated overlay), never as part of the resting card.

## Shapes

The form language is strictly square. Borders are hard 2px ink rules with zero rounding (`--radius: 0.25rem`, effectively straight corners on all chrome). Small tags, buttons, cards, inputs, and plates all read as straight-edge printed pieces — nothing pill-shaped except where a universal telephony or status affordance demands it. This is the opposite of the soft rounded boutique; even interactive elements commit to the straight line.

## Components

### Buttons
- **Shape:** square (0 radius), 2px ink border for secondary, flat fill for primary.
- **Primary ("Quiero esta pieza" / "Pagar boleto"):** safety orange fill, elevated text, `padding: 12px 28px`, mono uppercase label. Hover deepens to deep-orange.
- **Secondary:** black-nylon fill (or paper fill with 2px ink border), elevated text. Hover inverts on hover to the inverse fill.
- **Plate (label plates, e.g. "Correspondencia"):** paper fill, 2px ink border, display caps — reads as a printed stencil.

### Tags / Swing Tags
- **Style:** mono uppercase, small (≈0.6rem), on black-nylon fill with a paper "tie" dot above; the orange variant ("swing-tag") is the certainty tag on prices, discounts, and live status.
- **State:** tags carry a banner/stamp feel; the sale tag strikes through with hazard.

### Cards / Containers (ProductCard)
- **Corner Style:** square (0 radius).
- **Background:** paper elevated; product images sit on cotton.
- **Border:** 2px line at rest, 2px ink on group-hover.
- **Badges:** swing tags top-left (Nuevo / -__% / Últimas); on-sale pieces carry a hazard strike at the top edge.
- **Price:** a boxed "price ticket" (2px ink border) in mono, struck old-price beside it.

### Inputs / Fields
- **Style:** transparent, 2px ink bottom rule (the stockroom receipt line), mono input text.
- **Focus:** the underline swaps from line to safety orange; no glow.

### Navigation
- **Style:** sticky header with a 6px hazard strip across the top, square logo frame (2px ink), wordmark in quoted display caps, and a "Boutique · en venta" mono kick under it.
- **Links:** display caps, quoted, soft ink at rest → safety orange on hover.
- **Cart badge:** a swinging safety-orange swing tag (mini), with one swing animation on mount.
- **Mobile:** slide-in drawer with quoted column links; hazard strip retained.

### Accordion Rail (Instagram gallery, desktop only)
- **Style:** a single row of equal vertical strips (each a garment on the rail), separated by 1.5px gaps, squared borders.
- **Interaction:** hovering or focusing a strip grows it (flex-grow 2.2) and its title/tag fades in; the strip that is "open" reads as the piece being examined. Mobile collapses to a plain 3-col grid.

## Do's and Don'ts

### Do:
- **Do** set every zone and key label in straight-quoted display caps — wayfinding is reading.
- **Do** keep the single accent (safety orange) to price, action, remate, and live certainty.
- **Do** use hard 2px ink rules and square corners for all chrome.
- **Do** use the 45° hazard diagonal to strike through sale, remate, and off-rack states.
- **Do** set prices in mono inside a boxed "price ticket."
- **Do** use yellow-gold or cream-boutique tones for sale emphasis only as the hazard, never as a theme.

### Don't:
- **Don't** use rounded corners or pill buttons on chrome.
- **Don't** add soft ambient shadows to resting cards; keep depth flat, line-driven.
- **Don't** introduce a second saturated accent beyond safety orange.
- **Don't** use a warm serif display face or gold-muted-chic boutique styling.
- **Don't** rely on icons for navigation — quote the label instead.
- **Don't** let the accordion rail replace the grid on mobile; it is a hover appliance.