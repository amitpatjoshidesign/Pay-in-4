"use client"

import { type FormEvent, type ReactNode, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Languages,
  LockKeyhole,
  X,
} from "lucide-react"

import { PaymentMethodCard } from "@/components/checkout/payment-method-card"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
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
  directPayInFour?: boolean
}

type CheckoutStep = "address" | "pay"
type PaymentStage = "methods" | "card" | "success"

type AddressOption = {
  id: string
  recipient: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pinCode: string
}

const checkoutSteps: Array<{ id: CheckoutStep; label: string }> = [
  { id: "address", label: "Address" },
  { id: "pay", label: "Pay" },
]

const addressOptions: AddressOption[] = [
  {
    id: "product-office",
    recipient: "Product Team",
    email: "product.team@konehome.in",
    phone: "+91 98765 43021",
    line1: "7th Floor, Kone Home HQ, Powai",
    line2: "Central Avenue, Hiranandani Gardens",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400076",
  },
  {
    id: "design-studio",
    recipient: "Design Team",
    email: "design.team@konehome.in",
    phone: "+91 99887 76045",
    line1: "B-302, Kone Design Studio",
    line2: "12th Main, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560038",
  },
]

const supportedBanks = [
  { name: "ICICI Bank", logo: "/bank-logos/icici.svg" },
  { name: "SBI", logo: "/bank-logos/sbi.svg" },
  { name: "Axis Bank", logo: "/bank-logos/axis.svg" },
  { name: "Kotak", logo: "/bank-logos/kotak.svg" },
  { name: "HDFC Bank", logo: "/bank-logos/hdfc.svg" },
]

const getStepIndex = (step: CheckoutStep) =>
  checkoutSteps.findIndex((item) => item.id === step)

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

function FigmaCheckoutBar({
  currentStep,
  highestStepIndex,
  onStepSelect,
}: {
  currentStep: CheckoutStep
  highestStepIndex: number
  onStepSelect: (step: CheckoutStep) => void
}) {
  const currentStepIndex = getStepIndex(currentStep)

  return (
    <nav className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          {checkoutSteps.map((step, index) => {
            const isCurrent = step.id === currentStep
            const isCompleted = index < currentStepIndex
            const isAvailable = index <= highestStepIndex

            return (
              <div key={step.id} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-muted-foreground">»</span>
                ) : null}
                <button
                  type="button"
                  disabled={!isAvailable}
                  className={cn(
                    "rounded-[var(--radius)] px-2 py-1 transition-colors disabled:pointer-events-none disabled:text-muted-foreground",
                    isCurrent && "bg-muted text-foreground",
                    isCompleted && "text-primary"
                  )}
                  onClick={() => onStepSelect(step.id)}
                >
                  {step.label}
                </button>
              </div>
            )
          })}
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

function AddressStep({
  selectedAddressId,
  onAddressSelect,
  productHref,
  continueLabel = "Continue to pay",
}: {
  selectedAddressId: string
  onAddressSelect: (id: string) => void
  productHref: string
  continueLabel?: string
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-base font-semibold leading-6">Address</h2>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Saved addresses</h3>
        <RadioGroup
          value={selectedAddressId}
          onValueChange={onAddressSelect}
          className="gap-4"
        >
          {addressOptions.map((option) => {
            const selected = option.id === selectedAddressId

            return (
              <label
                key={option.id}
                htmlFor={`address-${option.id}`}
                className={cn(
                  "flex w-full cursor-pointer items-start justify-between gap-3 rounded-[var(--radius)] border p-3 text-left transition-colors",
                  selected
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {option.recipient}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {option.email}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {option.phone}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {option.line1}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {option.line2}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {option.city}, {option.state} {option.pinCode}
                  </span>
                </span>
                <RadioGroupItem
                  id={`address-${option.id}`}
                  value={option.id}
                  className="mt-1"
                />
              </label>
            )
          })}
        </RadioGroup>
      </div>

      <CheckoutStepFooter>
        <div className="grid grid-cols-[3rem_1fr] gap-3">
          <Link
            href={productHref}
            aria-label="Back"
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "size-12 rounded-full",
            })}
          >
            <ArrowLeft aria-hidden="true" />
          </Link>
          <Button
            type="submit"
            size="lg"
            className="h-12 rounded-full shadow-[var(--checkout-button-shadow)] hover:bg-primary/90"
          >
            {continueLabel}
          </Button>
        </div>
      </CheckoutStepFooter>
    </section>
  )
}

function CheckoutStepFooter({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_rgba(15,23,42,0.08)] backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </div>
  )
}

function CardDetailStep({
  dueToday,
  onBack,
}: {
  dueToday: number
  onBack: () => void
}) {
  const [saveCard, setSaveCard] = useState(false)

  return (
    <>
      <section className="flex flex-col gap-5">
        <div className="flex flex-col items-start gap-3 text-left">
          <Image
            src="/checkout-gateway/pay-in-4.svg"
            alt="Pay in 4"
            width={32}
            height={32}
            className="size-8"
          />
          <h2 className="text-base font-semibold leading-6 text-foreground">
            Add a new credit card for Pay in 4 payment
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Supported banks</p>
          <div className="flex items-center">
            {supportedBanks.map((bank, index) => (
              <div
                key={bank.name}
                className={cn(
                  "flex size-9 min-w-0 items-center justify-center rounded-full border border-white bg-muted p-2",
                  index > 0 && "-ml-1"
                )}
              >
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  width={48}
                  height={20}
                  className="max-h-4 max-w-7 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <FieldGroup className="gap-5">
          <Field className="gap-2">
            <FieldLabel className="text-sm font-medium">
              Card details
            </FieldLabel>
            <div className="overflow-hidden rounded-[var(--radius)] border bg-background">
              <div className="relative">
                <Input
                  aria-label="Card number"
                  inputMode="numeric"
                  defaultValue="4242 4242 4242 4560"
                  className="h-12 rounded-none border-0 px-4 font-mono text-base tracking-[0.04em] focus-visible:ring-0"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase italic text-primary">
                  Visa
                </span>
              </div>
              <div className="grid grid-cols-2 border-t">
                <Input
                  aria-label="Expiry date"
                  inputMode="numeric"
                  defaultValue="06/25"
                  className="h-12 rounded-none border-0 border-r px-4 font-mono text-base tracking-[0.04em] focus-visible:ring-0"
                />
                <Input
                  aria-label="CVV"
                  inputMode="numeric"
                  defaultValue="•••"
                  className="h-12 rounded-none border-0 px-4 font-mono text-base tracking-[0.16em] focus-visible:ring-0"
                />
              </div>
            </div>
          </Field>

          <Field className="gap-2">
            <FieldLabel className="text-sm font-medium">
              Card holder&apos;s name
            </FieldLabel>
            <Input
              defaultValue="Product Team"
              className="h-12 rounded-[var(--radius)] px-4 font-mono text-base"
            />
          </Field>
        </FieldGroup>

        <Field
          orientation="horizontal"
          className="items-start gap-3 rounded-[var(--radius)] border p-4"
        >
          <Checkbox
            checked={saveCard}
            onCheckedChange={(checked) => setSaveCard(Boolean(checked))}
            aria-label="Securely save card"
            className="mt-0.5"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium">
              Securely save your card for future payments
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pay faster on Kone for your next purchase
            </p>
          </div>
        </Field>
      </section>

      <CheckoutStepFooter>
        <div className="grid grid-cols-[3rem_1fr] gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-12 rounded-full"
            aria-label="Back"
            onClick={onBack}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <Button
            type="submit"
            size="lg"
            className="h-12 rounded-full shadow-[var(--checkout-button-shadow)] hover:bg-primary/90"
          >
            <LockKeyhole data-icon="inline-start" />
            Pay {formatCurrency(dueToday)}
          </Button>
        </div>
      </CheckoutStepFooter>
    </>
  )
}

function PaymentSuccessStep({
  dueToday,
  total,
  productHref,
}: {
  dueToday: number
  total: number
  productHref: string
}) {
  return (
    <section className="flex min-h-[360px] flex-col items-center justify-center gap-5 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-9" aria-hidden="true" />
      </div>
      <div className="max-w-sm">
        <h2 className="text-2xl font-semibold tracking-tight">
          Payment successful
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your Pay in 4 plan is active. {formatCurrency(dueToday)} was paid
          today and the remaining {formatCurrency(total - dueToday)} is split
          across three upcoming payments.
        </p>
      </div>
      <Card className="w-full max-w-sm rounded-[var(--radius)] border-border ring-0 shadow-[var(--checkout-shadow)]">
        <CardContent className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Paid today</span>
            <span className="font-semibold">{formatCurrency(dueToday)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Payment method</span>
            <span className="font-semibold">Visa ending 4560</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-primary">Confirmed</span>
          </div>
        </CardContent>
      </Card>
      <Link
        href={productHref}
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          className: "h-12 rounded-full px-6",
        })}
      >
        Back to product
      </Link>
    </section>
  )
}

export function PayInFourDemo({
  product,
  directPayInFour = false,
}: PayInFourDemoProps) {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address")
  const [highestStepIndex, setHighestStepIndex] = useState(0)
  const [selectedAddressId, setSelectedAddressId] = useState("product-office")
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("pay-in-4")
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("methods")
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

  const dueToday =
    paymentMethod === "pay-in-4"
      ? order.total / 4
      : paymentMethod === "bnpl"
        ? 0
      : order.total

  const submitLabel =
    paymentMethod === "pay-in-4"
      ? "Continue with Pay in 4"
      : paymentMethod === "upi"
        ? "Pay with UPI"
        : paymentMethod === "emi"
          ? "Continue EMI"
          : paymentMethod === "bnpl"
            ? "Continue BNPL"
            : paymentMethod === "wallet"
              ? "Pay with Wallet"
              : "Pay Netbanking"

  function handleStepSelect(step: CheckoutStep) {
    const stepIndex = getStepIndex(step)

    if (stepIndex <= highestStepIndex) {
      setCheckoutStep(step)

      if (directPayInFour && step === "pay") {
        setPaymentMethod("pay-in-4")
        setPaymentStage("card")
        return
      }

      setPaymentStage("methods")
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (checkoutStep === "address") {
      setHighestStepIndex((current) => Math.max(current, 1))
      setCheckoutStep("pay")

      if (directPayInFour) {
        setPaymentMethod("pay-in-4")
        setPaymentStage("card")
        return
      }

      setPaymentStage("methods")
      return
    }

    if (checkoutStep === "pay" && paymentStage === "methods") {
      if (paymentMethod === "pay-in-4") {
        setPaymentStage("card")
        return
      }

      setPaymentStage("success")
      return
    }

    if (checkoutStep === "pay" && paymentStage === "card") {
      setPaymentStage("success")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FigmaCheckoutBar
        currentStep={checkoutStep}
        highestStepIndex={highestStepIndex}
        onStepSelect={handleStepSelect}
      />
      <CheckoutOrderHeader
        amount={order.total}
        subtotal={order.subtotal}
        productHref={product.href}
      />
      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:px-6 md:py-6">
        <section className="flex min-w-0 flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {checkoutStep === "address" ? (
              <AddressStep
                selectedAddressId={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
                productHref={product.href}
                continueLabel={
                  directPayInFour ? "Continue to Pay in 4" : "Continue to pay"
                }
              />
            ) : null}

            {checkoutStep === "pay" && paymentStage === "methods" ? (
              <>
                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold leading-6">
                    Best for you
                  </h2>
                  <Card className="rounded-[20px] border-border py-0 ring-0 shadow-[var(--checkout-shadow)]">
                    <CardContent className="flex flex-col gap-3 py-4">
                      <FieldSet aria-label="Best payment method">
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={(value) => {
                            setPaymentMethod(value as PaymentMethod)
                            setPaymentStage("methods")
                          }}
                        >
                          {recommendedPaymentMethods.map((method) => (
                            <div key={method.value}>
                              <PaymentMethodCard
                                id={method.id}
                                value={method.value}
                                title={method.title}
                                description={method.description}
                                detail={method.detail}
                                icon={method.icon}
                                iconSrc={method.iconSrc}
                                selected={paymentMethod === method.value}
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </FieldSet>
                      {paymentMethod === "pay-in-4" ? (
                        <PayInFourWidget total={order.total} embedded />
                      ) : null}
                    </CardContent>
                  </Card>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold leading-6">
                    Other payment methods
                  </h2>
                  <Card className="rounded-[20px] border-border py-0 ring-0 shadow-[var(--checkout-shadow)]">
                    <CardContent className="py-4">
                      <FieldSet aria-label="Other payment methods">
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={(value) => {
                            setPaymentMethod(value as PaymentMethod)
                            setPaymentStage("methods")
                          }}
                          className="gap-0"
                        >
                          {otherPaymentMethods.map((method, index) => {
                            const isFirst = index === 0
                            const isLast =
                              index === otherPaymentMethods.length - 1

                            return (
                              <div key={method.value}>
                                <div
                                  className={cn(
                                    "py-3",
                                    isFirst && "pt-0",
                                    isLast && "pb-0"
                                  )}
                                >
                                  <PaymentMethodCard
                                    id={method.id}
                                    value={method.value}
                                    title={method.title}
                                    description={method.description}
                                    detail={method.detail}
                                    icon={method.icon}
                                    iconSrc={method.iconSrc}
                                    selected={paymentMethod === method.value}
                                  />
                                </div>
                                {!isLast ? (
                                  <Separator className="bg-border/70" />
                                ) : null}
                              </div>
                            )
                          })}
                        </RadioGroup>
                      </FieldSet>
                    </CardContent>
                  </Card>
                </section>

                <CheckoutStepFooter>
                  <div className="grid grid-cols-[3rem_1fr] gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-12 rounded-full"
                      aria-label="Back"
                      onClick={() => {
                        setCheckoutStep("address")
                        setPaymentStage("methods")
                      }}
                    >
                      <ArrowLeft aria-hidden="true" />
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 rounded-full shadow-[var(--checkout-button-shadow)] hover:bg-primary/90"
                    >
                      <LockKeyhole data-icon="inline-start" />
                      {submitLabel}
                    </Button>
                  </div>
                </CheckoutStepFooter>
              </>
            ) : null}

            {checkoutStep === "pay" && paymentStage === "card" ? (
              <CardDetailStep
                dueToday={dueToday}
                onBack={() => {
                  if (directPayInFour) {
                    setCheckoutStep("address")
                    setPaymentStage("methods")
                    return
                  }

                  setPaymentStage("methods")
                }}
              />
            ) : null}

            {checkoutStep === "pay" && paymentStage === "success" ? (
              <PaymentSuccessStep
                dueToday={dueToday}
                total={order.total}
                productHref={product.href}
              />
            ) : null}
          </form>
        </section>

      </main>
    </div>
  )
}
