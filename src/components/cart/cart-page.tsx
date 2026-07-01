"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react"

import { CartButton } from "@/components/cart/cart-button"
import { useCart } from "@/components/cart/cart-context"
import { PayInFourThemePopover, usePayInFourTheme } from "@/components/pay-in-four-theme"
import { Pay4EligibilityProgress } from "@/components/product/pay4-eligibility-progress"
import { ProductBrand } from "@/components/product/product-brand"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createPay4BreakdownDisplay,
  createCheckoutOrderFromCart,
  formatCurrency,
} from "@/data/checkout"
import { cn } from "@/lib/utils"

export function CartPage() {
  const { merchantOfferEnabled } = usePayInFourTheme()
  const [mobileSummaryExpanded, setMobileSummaryExpanded] = useState(false)
  const {
    hydrated,
    items,
    subtotal,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart()
  const order = createCheckoutOrderFromCart(items, merchantOfferEnabled)

  if (!hydrated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <ProductBrand />
          <div className="flex items-center gap-2">
            <PayInFourThemePopover />
            <CartButton />
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-0 pb-44 md:px-6 md:pb-6 md:pt-6">
        <div className="hidden items-start justify-between gap-4 md:flex">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">Cart</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review your items and unlock Pay4 on carts above {formatCurrency(5000)}.
            </p>
          </div>
          {items.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              className="mt-0 px-0"
              onClick={clearCart}
            >
              Clear cart
            </Button>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="sticky top-0 z-30 -mx-4 md:hidden">
            <div className="bg-[#005857] px-4 py-4 text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Cart</h1>
                  <p className="mt-2 text-sm text-white/70">
                    Review your items and unlock Pay4 on carts above {formatCurrency(5000)}.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-0 px-0 text-white hover:bg-transparent hover:text-white"
                  onClick={clearCart}
                >
                  Clear cart
                </Button>
              </div>
              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-[14px] font-medium capitalize leading-6 tracking-[0.04em]"
                onClick={() => setMobileSummaryExpanded((value) => !value)}
                aria-expanded={mobileSummaryExpanded}
                aria-controls="mobile-cart-breakdown"
              >
                Order Summary
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    mobileSummaryExpanded && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {mobileSummaryExpanded ? (
                <div
                  id="mobile-cart-breakdown"
                  className="mt-4 grid gap-2 border-t border-white/15 pt-4 text-sm"
                >
                  {order.pay4Eligible ? (
                    <CartPay4Breakdown order={order} mobile />
                  ) : null}
                  {!order.pay4Eligible ? (
                    <>
                      <HeaderBreakdownRow label="Subtotal" value={formatCurrency(subtotal)} />
                      {order.payInFourDiscountAmount > 0 ? (
                        <HeaderBreakdownRow
                          label={order.merchantOffer?.label ?? "Merchant offer"}
                          value={`-${formatCurrency(order.payInFourDiscountAmount)}`}
                        />
                      ) : null}
                      <HeaderBreakdownRow label="Delivery" value="Included" />
                      <HeaderBreakdownRow label="GST" value="Included" />
                      <HeaderBreakdownRow
                        label="Total"
                        value={formatCurrency(order.total)}
                        strong
                      />
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {items.length === 0 ? (
          <Card className="rounded-[calc(var(--radius)*1.5)] border-0 ring-0 shadow-[var(--checkout-soft-shadow)]">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Add products from the home screen or product pages to showcase combined Pay4 eligibility.
              </p>
              <Link
                href="/"
                className={buttonVariants({ size: "lg", className: "rounded-full" })}
              >
                Continue shopping
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Card className="rounded-[calc(var(--radius)*1.5)] border-0 py-0 ring-0 shadow-[var(--checkout-soft-shadow)]">
              <CardContent className="p-0">
                {items.map((item, index) => (
                  <div
                    key={item.product.id}
                    className={cn(
                      "relative flex items-start gap-3 p-4 sm:gap-4"
                    )}
                  >
                    {index > 0 ? (
                      <div className="absolute inset-x-4 top-0 h-px bg-border/50" />
                    ) : null}
                    <div className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] bg-background sm:h-24 sm:w-[4.8rem]">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="scale-[1.2] object-contain p-2"
                        sizes="(min-width: 640px) 76px, 64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={item.product.href}
                        className="block text-base font-semibold hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {item.product.subtitle}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <p className="text-base font-semibold tabular-nums">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex w-fit items-center gap-2 rounded-full border px-2 py-1">
                            <button
                              type="button"
                              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label={`Decrease quantity for ${item.product.name}`}
                              onClick={() => decrementItem(item.product.id)}
                            >
                              <Minus className="size-4" aria-hidden="true" />
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label={`Increase quantity for ${item.product.name}`}
                              onClick={() => incrementItem(item.product.id)}
                            >
                              <Plus className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-10 shrink-0 rounded-full text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${item.product.name}`}
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="hidden rounded-[calc(var(--radius)*1.5)] border-0 ring-0 shadow-[var(--checkout-shadow)] lg:sticky lg:top-6 lg:flex">
              <CardHeader className="border-b">
                <CardTitle>Cart summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {!order.pay4Eligible ? (
                  <Pay4EligibilityProgress currentAmount={subtotal} className="shadow-none" />
                ) : (
                  <CartPay4Breakdown order={order} />
                )}

                {!order.pay4Eligible ? (
                  <>
                    <div className="grid gap-2 text-sm">
                      <SummaryRow label="Subtotal" value={subtotal} />
                      {order.payInFourDiscountAmount > 0 ? (
                        <SummaryRow
                          label={order.merchantOffer?.label ?? "Merchant offer"}
                          value={`-${formatCurrency(order.payInFourDiscountAmount)}`}
                        />
                      ) : null}
                      <SummaryRow label="Delivery" value="Included" />
                      <SummaryRow label="GST" value="Included" />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <p className="font-medium">Total</p>
                      <p className="text-xl font-semibold tabular-nums">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </>
                ) : null}

                <Link
                  href="/checkout"
                  className={buttonVariants({
                    size: "lg",
                    className: cn("h-12 rounded-full shadow-[var(--checkout-button-shadow)]"),
                  })}
                >
                  Proceed to checkout
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {items.length > 0 && !order.pay4Eligible ? (
        <div className="fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-50 px-4 lg:hidden">
          <div className="mx-auto w-full max-w-6xl">
            <Pay4EligibilityProgress currentAmount={subtotal} className="shadow-[0_-12px_32px_rgba(15,23,42,0.08)]" />
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden supports-[backdrop-filter]:bg-background/85">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-semibold tabular-nums">
                {formatCurrency(order.total)}
              </p>
            </div>
            <Link
              href="/checkout"
              className={buttonVariants({
                size: "lg",
                className: cn("h-12 !rounded-full px-5 shadow-[var(--checkout-button-shadow)]"),
              })}
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function HeaderBreakdownRow({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/70">{label}</span>
      <span className={cn("tabular-nums text-white", strong ? "font-semibold" : "font-medium")}>
        {value}
      </span>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">
        {typeof value === "number" ? formatCurrency(value) : value}
      </span>
    </div>
  )
}

function CartPay4Breakdown({
  order,
  mobile = false,
}: {
  order: ReturnType<typeof createCheckoutOrderFromCart>
  mobile?: boolean
}) {
  const breakdown = createPay4BreakdownDisplay(order)

  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)*1.2)] border p-4",
        mobile ? "mb-2 border-white/10 bg-white/8 text-white" : "bg-primary/5"
      )}
    >
      <p className={cn("text-sm font-semibold", mobile ? "text-white" : "text-primary")}>
        Pay4 Breakdown
      </p>

      <div className="mt-4 grid gap-2 text-sm">
        <SummaryLikeRow
          label="Order Value"
          value={formatCurrency(breakdown.orderValue)}
          mobile={mobile}
        />
        <SummaryLikeRow
          label="Amount charged to your card today"
          value={formatCurrency(breakdown.amountChargedToday)}
          mobile={mobile}
        />
        <SummaryLikeRow
          label="Pay4 benefit (upfront adjustment)"
          value={`-${formatCurrency(breakdown.pay4Benefit)}`}
          mobile={mobile}
        />
      </div>

      <div className={cn("my-4 h-px", mobile ? "bg-white/15" : "bg-border")} />

      <p className={cn("text-sm font-semibold", mobile ? "text-white" : "text-foreground")}>
        Your EMI Plan
      </p>
      <div className="mt-3 grid gap-2 text-sm">
        <SummaryLikeRow
          label="4 monthly instalments"
          value={formatCurrency(breakdown.monthlyInstallment)}
          mobile={mobile}
        />
        <SummaryLikeRow
          label="Total you'll repay"
          value={formatCurrency(breakdown.totalRepayment)}
          mobile={mobile}
        />
      </div>

      {!mobile ? (
        <div className="mt-4">
          <PayInFourWidget
            total={order.payInFourTotal}
            originalTotal={order.total}
            embedded
            offerPercent={order.merchantOffer?.value || undefined}
          />
        </div>
      ) : null}
    </div>
  )
}

function SummaryLikeRow({
  label,
  value,
  mobile = false,
}: {
  label: string
  value: string
  mobile?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className={mobile ? "text-white/70" : "text-muted-foreground"}>{label}</span>
      <span
        className={cn(
          "shrink-0 tabular-nums",
          mobile ? "text-white" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  )
}
