# Pay in 4 Checkout Demo

Product demo for a Pay in 4 payment option built with Next.js, Tailwind CSS v4, and shadcn/ui.

## Project Structure

- `src/app/page.tsx` renders the sofa catalog.
- `src/app/product/[slug]/page.tsx` renders product detail pages for each sofa.
- `src/app/checkout/page.tsx` renders the Plural-style gateway checkout screen.
- `src/app/checkout/classic/page.tsx` keeps the earlier checkout form for testing.
- `src/components/checkout/gateway-checkout-screen.tsx` owns the Figma-style payment options layout.
- `src/components/checkout/pay-in-four-demo.tsx` owns the classic checkout state and layout.
- `src/components/checkout/payment-method-card.tsx` renders selectable payment methods.
- `src/components/checkout/installment-schedule.tsx` renders the Pay in 4 payment plan.
- `src/components/checkout/order-summary.tsx` renders totals and due-today messaging.
- `src/data/checkout.ts` stores sofa catalog data, INR pricing, payment options, and currency helpers.
- `src/components/ui/*` contains shadcn-generated primitives.

## Run

```bash
npm run dev
```

Then open `http://localhost:3000`.
