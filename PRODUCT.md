# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing monorepo, three web apps (React + Vite + TypeScript, Tailwind 4):

- `frontend/` — customer storefront, React 19 + Vite, Tailwind 4, shadcn-style tokens, React Router 7, React Query, framer-motion, swiper, socket.io-client. Dev port 5175, served via nginx (port 80 in docker).
- `administrador/` — admin panel, React + Vite, Tailwind 4, recharts, dark/light theme, socket.io-client. Dev port 5173.
- `backend/` — Express 5 API, better-sqlite3 (`yenyleths.db`), JWT auth, zod validation, helmet, rate limiting, morgan, multer uploads (`backend/uploads`), socket.io (chat + video-call signaling), payment service with `MOCK_PAYMENT_MODE`. Port 5000.

## Users

- **Shoppers** browsing and buying premium fashion from the storefront (clothing, jerseys, footwear/crocs, boots, hats, accessories). Buying situation and geographic segment are not yet confirmed; evidence (Spanish copy, a "Sombrero Panameño" product) suggests Panama, but this is an inference, not a stated fact.
- **Store operator/owner** running the business through the admin panel (catalog, orders, customers, marketing, reports, chat).
- Immediate stated goal for this work: improve the storefront.

## Product Purpose

Yenyleths Store is a premium fashion e-commerce. Customers browse a curated catalog, use wishlist/cart/checkout, and manage an account with a full membership dashboard; the operator manages catalog, orders, marketing, and chat from the admin panel. Success means a storefront that converts premium shoppers and an admin experience that keeps the store easy to run.

## Positioning

A full membership-commerce ecosystem, not just a catalog: video-call sales assistance, loyalty program, referral program, wallet, coupons, notifications, reviews, support chat, returns/refunds, and analytics — all integrated into one storefront + admin pair. The differentiator is the completeness of the buying-and-loyalty experience and the personal video-call sales touch.

## Operating Context

- All storefront copy is Spanish.
- Workflow: admin uploads category/product with images → backend stores and serves via `/uploads/...` → storefront consumes from the API and renders catalog, home sections (hero slideshow, flash sale, featured categories, carousels, testimonials, Instagram gallery), category pages, product detail with quick view, checkout, search, and account/dashboard.
- Live sales assistance: socket.io chat plus a WebRTC video-call flow (incoming-call notification, video call UI) on both storefront and admin.
- Payments: service layer with mock mode enabled via env (`MOCK_PAYMENT_MODE=true`).
- DB is SQLite (`backend/yenyleths.db`); older `backend/db.json` still holds a product seed.

## Capabilities and Constraints

- Storefront: home, category listing, product detail, quick-view modal, search, wishlist, cart drawer, checkout, login/signup, privacy policy, customer dashboard (orders, order tracking, wishlist, cart, profile, addresses, payment methods, loyalty, coupons, notifications, reviews, messages, returns/refunds, wallet, referrals, analytics, security, support).
- Admin: dashboard, products and categories CRUD with multi-image upload, orders, customers, flash sale, marketing, reports, trending, best sellers, chat, payments config, settings, command palette, dark/light theme.
- Product catalog images already ship in `frontend/src/assets/images/products/` (jerseys, crocs, boots, sets); several categories currently fall back to `picsum.photos` placeholders — real assets for those are not on hand.
- API: `/api/products`, `/api/categories`, auth, orders, coupons, reviews, chat, reports, payments.
- Currency displayed as `$` (USD convention); precise pricing/currency policy not confirmed.

## Brand Commitments

- Name: **Yenyleths Store** — the name and logo are the brand anchors.
- Logo asset: `image/yenyleths.png` (original), `frontend/src/assets/images/logo.webp` (web asset).
- Brand voice is flexible; nothing else is binding.

## Evidence on Hand

- Product copy, catalog seeds, and real product images in `frontend/src/assets/images/products/` and `backend/db.json`.
- Screenshots of the current storefront in `image/` (Captura de pantalla *.png).
- `README.md`, `START.md`, `docker-compose.yml`, `start.sh` document run/deploy workflow.
- Current visual system in code: storefront uses cream/brown/gold-that-is-pink tokens (`frontend/src/index.css`); admin uses gold + pink + dark mode (`administrador/src/index.css`). Recorded as incumbent evidence only — not a binding commitment.

## Product Principles

1. The ecosystem is the product — loyalty, wallet, referrals, coupons, and live help must feel like one coherent membership experience, never bolt-on pages.
2. Premium positioning over bargain-store feel: the storefront must make the curated catalog feel valuable before price.
3. The operator's job must stay efficient — admin flows (product/category CRUD, uploads, orders) outrank admin aesthetics.
4. Live sales (chat + video call) is a real customer-facing capability and must not be styled as an afterthought.
5. Preserve all confirmed factual content (Spanish copy, prices, product truth); replace only the visual presentation.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established.
