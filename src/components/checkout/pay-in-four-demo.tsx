"use client"

import { type FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  ChevronDown,
  Languages,
  LockKeyhole,
  X,
} from "lucide-react"

import { PaymentMethodCard } from "@/components/checkout/payment-method-card"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldSet } from "@/components/ui/field"
import { RadioGroup } from "@/components/ui/radio-group"
import {
  createCheckoutOrder,
  createPaymentMethods,
  formatCurrency,
  type Product,
  type PaymentMethod,
} from "@/data/checkout"
import { cn } from "@/lib/utils"

type PayInFourDemoProps = {
  product: Product
}

const formatHeaderCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)

function CheckoutOrderHeader({
  amount,
  subtotal,
  productHref,
}: {
  amount: number
  subtotal: number
  productHref: string
}) {
  const [expanded, setExpanded] = useState(false)
  const formattedAmount = formatHeaderCurrency(amount)
  const [wholeAmount, decimalAmount = "00"] = formattedAmount.split(".")

  return (
    <header className="bg-background">
      <div className="mx-auto flex w-full max-w-[428px] flex-col bg-primary px-4 py-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-6 items-center justify-center rounded-full bg-background text-base font-bold text-primary">
              K
            </div>
            <p className="text-[13px] font-medium">Kone</p>
          </div>
          <Link
            href={productHref}
            aria-label="Close checkout"
            className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
          >
            <X className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6">
          <p className="text-[32px] font-semibold leading-10 tracking-[0.02em]">
            <span>{wholeAmount}</span>
            <span className="font-normal text-primary-foreground/60">
              .{decimalAmount}
            </span>
          </p>
          <button
            type="button"
            aria-expanded={expanded}
            className="mt-1 flex items-center gap-1 text-[14px] font-medium capitalize leading-6 tracking-[0.04em]"
            onClick={() => setExpanded((current) => !current)}
          >
            Order Summary
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                expanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {expanded ? (
          <div className="mt-4 grid gap-2 border-t border-primary-foreground/15 pt-4 text-sm">
            <HeaderBreakdownRow
              label="Subtotal"
              value={formatCurrency(subtotal)}
            />
            <HeaderBreakdownRow label="Delivery" value="Included" />
            <HeaderBreakdownRow label="GST" value="Included" />
            <HeaderBreakdownRow
              label="Total"
              value={formatCurrency(amount)}
              strong
            />
          </div>
        ) : null}
      </div>
    </header>
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
      <span className="text-primary-foreground/70">{label}</span>
      <span
        className={cn(
          "tabular-nums text-primary-foreground",
          strong ? "font-semibold" : "font-medium"
        )}
      >
        {value}
      </span>
    </div>
  )
}

function FigmaCheckoutBar() {
  return (
    <nav className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <span>Contact</span>
          <span className="text-muted-foreground">»</span>
          <span>Address</span>
          <span className="text-muted-foreground">»</span>
          <span className="rounded-[var(--radius)] bg-muted px-2 py-1">
            Pay
          </span>
        </div>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-[var(--radius)] border bg-background px-2"
          aria-label="Change language"
        >
          <Languages className="size-4" aria-hidden="true" />
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

export function PayInFourDemo({ product }: PayInFourDemoProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("pay-in-4")
  const [submitted, setSubmitted] = useState(false)
  const order = useMemo(() => createCheckoutOrder(product), [product])
  const paymentMethods = useMemo(() => createPaymentMethods(order), [order])
  const recommendedPaymentMethods = useMemo(
    () => paymentMethods.filter((method) => method.value === "pay-in-4"),
    [paymentMethods]
  )
  const otherPaymentMethods = useMemo(
    () => paymentMethods.filter((method) => method.value !== "pay-in-4"),
    [paymentMethods]
  )

  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.value === paymentMethod),
    [paymentMethod, paymentMethods]
  )

  const dueToday =
    paymentMethod === "pay-in-4"
      ? order.total / 4
      : paymentMethod === "bnpl"
        ? 0
      : order.total

  const submitLabel =
    paymentMethod === "emi"
      ? "Continue with EMI"
      : paymentMethod === "bnpl"
        ? "Continue with Buy Now Pay Later"
        : `Place order · ${formatCurrency(dueToday)} today`

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <FigmaCheckoutBar />
      <CheckoutOrderHeader
        amount={order.total}
        subtotal={order.subtotal}
        productHref={product.href}
      />
      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:px-6 md:py-6">
        <section className="flex min-w-0 flex-col gap-4">
          {submitted ? (
            <Alert className="border-primary/20 bg-accent">
              <CheckCircle2 className="text-primary" aria-hidden="true" />
              <AlertTitle>
                {selectedMethod?.title} selected for this order
              </AlertTitle>
              <AlertDescription>
                {paymentMethod === "pay-in-4"
                  ? `${formatCurrency(dueToday)} is due today. The remaining payments are scheduled every 2 weeks.`
                  : paymentMethod === "bnpl"
                    ? "Provider approval is completed on the next step before any payment is collected."
                  : `${formatCurrency(dueToday)} will be charged when the order is placed.`}
              </AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold leading-6">
                Best for you
              </h2>
              <Card className="rounded-[var(--radius)] border-border ring-0 shadow-[var(--checkout-shadow)]">
                <CardContent>
                  <FieldSet aria-label="Best payment method">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => {
                        setPaymentMethod(value as PaymentMethod)
                        setSubmitted(false)
                      }}
                    >
                      {recommendedPaymentMethods.map((method) => (
                        <PaymentMethodCard
                          key={method.value}
                          id={method.id}
                          value={method.value}
                          title={method.title}
                          description={method.description}
                          detail={method.detail}
                          badge={method.badge}
                          offer={method.offer}
                          icon={method.icon}
                          iconSrc={method.iconSrc}
                          selected={paymentMethod === method.value}
                        />
                      ))}
                    </RadioGroup>
                  </FieldSet>
                  {paymentMethod === "pay-in-4" ? (
                    <PayInFourWidget
                      total={order.total}
                      defaultExpanded
                      embedded
                    />
                  ) : null}
                </CardContent>
              </Card>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold leading-6">
                Other payment methods
              </h2>
              <Card className="rounded-[var(--radius)] border-border ring-0 shadow-[var(--checkout-shadow)]">
                <CardContent>
                  <FieldSet aria-label="Other payment methods">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => {
                        setPaymentMethod(value as PaymentMethod)
                        setSubmitted(false)
                      }}
                      className="divide-y divide-border/70"
                    >
                      {otherPaymentMethods.map((method) => (
                        <PaymentMethodCard
                          key={method.value}
                          id={method.id}
                          value={method.value}
                          title={method.title}
                          description={method.description}
                          detail={method.detail}
                          badge={method.badge}
                          offer={method.offer}
                          icon={method.icon}
                          iconSrc={method.iconSrc}
                          selected={paymentMethod === method.value}
                        />
                      ))}
                    </RadioGroup>
                  </FieldSet>
                </CardContent>
              </Card>
            </section>

            <div className="flex flex-col items-stretch">
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-full shadow-[var(--checkout-button-shadow)] hover:bg-primary/90"
              >
                <LockKeyhole data-icon="inline-start" />
                {submitLabel}
              </Button>
            </div>
          </form>
        </section>

      </main>
    </div>
  )
}
