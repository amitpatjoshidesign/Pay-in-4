"use client"

import {
  type CSSProperties,
  useEffect,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Languages,
  LockKeyhole,
  X,
} from "lucide-react"

import { useCart } from "@/components/cart/cart-context"
import { PaymentMethodCard } from "@/components/checkout/payment-method-card"
import {
  PayInFourThemePopover,
  usePayInFourTheme,
} from "@/components/pay-in-four-theme"
import { Pay4EligibilityProgress } from "@/components/product/pay4-eligibility-progress"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  createPay4BreakdownDisplay,
  createCheckoutOrderFromCart,
  createPaymentMethods,
  formatCurrency,
  splitInstallments,
  type PaymentMethod,
} from "@/data/checkout"
import { cn } from "@/lib/utils"

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

type SavedPayInFourCard = {
  id: string
  bank: string
  bankLogo: string
  network: string
  last4: string
  expiry: string
}

const savedPayInFourCards = [
  {
    id: "icici-4560",
    bank: "ICICI Bank",
    bankLogo: "/bank-logos/icici.svg",
    network: "Visa",
    last4: "4560",
    expiry: "06/25",
  },
  {
    id: "axis-1188",
    bank: "Axis Bank",
    bankLogo: "/bank-logos/axis.svg",
    network: "Visa",
    last4: "1188",
    expiry: "09/26",
  },
  {
    id: "hdfc-9021",
    bank: "HDFC Bank",
    bankLogo: "/bank-logos/hdfc.svg",
    network: "Visa",
    last4: "9021",
    expiry: "12/27",
  },
] satisfies [SavedPayInFourCard, ...SavedPayInFourCard[]]

const defaultSavedPayInFourCard = savedPayInFourCards[0]

const successConfettiPieces = [
  { x: "-132px", y: "84px", rotate: "-138deg", color: "#017373", delay: "0ms" },
  { x: "-92px", y: "132px", rotate: "96deg", color: "#f59e0b", delay: "42ms" },
  { x: "-48px", y: "72px", rotate: "-74deg", color: "#1456b8", delay: "86ms" },
  { x: "-16px", y: "148px", rotate: "156deg", color: "#d94675", delay: "126ms" },
  { x: "28px", y: "92px", rotate: "-118deg", color: "#10b981", delay: "24ms" },
  { x: "68px", y: "136px", rotate: "124deg", color: "#8b5cf6", delay: "70ms" },
  { x: "112px", y: "80px", rotate: "-92deg", color: "#ef4444", delay: "112ms" },
  { x: "144px", y: "124px", rotate: "142deg", color: "#0ea5e9", delay: "150ms" },
  { x: "-118px", y: "184px", rotate: "176deg", color: "#84cc16", delay: "174ms" },
  { x: "106px", y: "188px", rotate: "-156deg", color: "#f97316", delay: "198ms" },
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
  discountAmount,
  merchantOfferLabel,
  mrp,
  pay4Eligible,
  pay4Breakdown,
  subtotal,
  productHref,
}: {
  amount: number
  discountAmount: number
  merchantOfferLabel?: string
  mrp: number
  pay4Eligible: boolean
  pay4Breakdown?: ReturnType<typeof createPay4BreakdownDisplay>
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
            {pay4Eligible && pay4Breakdown ? (
              <CheckoutPay4Breakdown breakdown={pay4Breakdown} />
            ) : discountAmount > 0 ? (
              <>
                <HeaderBreakdownRow label="MRP" value={formatCurrency(mrp)} />
                <HeaderBreakdownRow
                  label={merchantOfferLabel ?? "Merchant offer"}
                  value={`-${formatCurrency(discountAmount)}`}
                />
                <HeaderBreakdownRow label="Delivery" value="Included" />
                <HeaderBreakdownRow label="GST" value="Included" />
                <HeaderBreakdownRow
                  label="Total"
                  value={formatCurrency(amount)}
                  strong
                />
              </>
            ) : (
              <>
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
              </>
            )}
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

function CheckoutPay4Breakdown({
  breakdown,
}: {
  breakdown: ReturnType<typeof createPay4BreakdownDisplay>
}) {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground">
        Pay4 Breakdown
      </p>
      <HeaderBreakdownRow
        label="Order Value"
        value={formatCurrency(breakdown.orderValue)}
      />
      <HeaderBreakdownRow
        label="Amount charged to your card today"
        value={formatCurrency(breakdown.amountChargedToday)}
      />
      <HeaderBreakdownRow
        label="Pay4 benefit (upfront adjustment)"
        value={`-${formatCurrency(breakdown.pay4Benefit)}`}
      />

      <div className="my-2 h-px bg-primary-foreground/15" />

      <p className="text-sm font-semibold text-primary-foreground">
        Your EMI Plan
      </p>
      <HeaderBreakdownRow
        label="4 monthly instalments"
        value={formatCurrency(breakdown.monthlyInstallment)}
      />
      <HeaderBreakdownRow
        label="Total you'll repay"
        value={formatCurrency(breakdown.totalRepayment)}
        strong
      />
    </>
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
        <div className="flex shrink-0 items-center gap-2">
          <PayInFourThemePopover />
          <button
            type="button"
            className="flex h-8 items-center justify-center gap-1 rounded-[var(--radius)] border bg-background px-2"
            aria-label="Change language"
          >
            <Languages className="size-4" aria-hidden="true" />
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </div>
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

function SupportedBanksList({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {!compact ? (
        <p className="text-sm font-medium">Supported banks</p>
      ) : null}
      <div className="flex items-center">
        {supportedBanks.map((bank, index) => (
          <div
            key={bank.name}
            className={cn(
              "flex min-w-0 items-center justify-center rounded-full border border-white bg-muted",
              compact ? "size-8 p-1.5" : "size-9 p-2",
              index > 0 && "-ml-1"
            )}
          >
            <Image
              src={bank.logo}
              alt={bank.name}
              width={48}
              height={20}
              className={cn(
                "object-contain",
                compact ? "max-h-3.5 max-w-6" : "max-h-4 max-w-7"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function NewCardFields({
  saveCard,
  onSaveCardChange,
}: {
  saveCard: boolean
  onSaveCardChange: (checked: boolean) => void
}) {
  return (
    <>
      <FieldGroup className="gap-5">
        <Field className="gap-2">
          <FieldLabel className="text-sm font-medium">Card details</FieldLabel>
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
                defaultValue="..."
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
          onCheckedChange={(checked) => onSaveCardChange(Boolean(checked))}
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
    </>
  )
}

function SavedCardFields({
  selectedCardId,
  onSelectedCardChange,
}: {
  selectedCardId: string
  onSelectedCardChange: (cardId: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <RadioGroup
        value={selectedCardId}
        onValueChange={onSelectedCardChange}
        className="gap-3"
        aria-label="Saved Pay4 cards"
      >
        {savedPayInFourCards.map((card) => (
          <label
            key={card.id}
            htmlFor={`saved-card-${card.id}`}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-3 rounded-[16px] border bg-background p-4 transition-colors",
              selectedCardId === card.id
                ? "border-primary/35"
                : "border-border hover:border-primary/25"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted/40">
                <Image
                  src={card.bankLogo}
                  alt={card.bank}
                  width={48}
                  height={20}
                  className="max-h-5 max-w-8 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {card.network} card XXXX {card.last4}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expires {card.expiry}
                </p>
              </div>
            </div>
            <RadioGroupItem
              id={`saved-card-${card.id}`}
              value={card.id}
              className="shrink-0"
            />
          </label>
        ))}
      </RadioGroup>

      <p className="text-sm leading-6 text-muted-foreground">
        Saved cards are tokenised as per RBI guidelines. No CVV is required for
        this payment.
      </p>
    </div>
  )
}

function CardDetailStep({
  dueToday,
  onBack,
  onChangePaymentMethod,
  selectedCardId,
  onSelectedCardChange,
}: {
  dueToday: number
  onBack: () => void
  onChangePaymentMethod?: () => void
  selectedCardId: string
  onSelectedCardChange: (cardId: string) => void
}) {
  const { cardJourney } = usePayInFourTheme()
  const [saveCard, setSaveCard] = useState(false)
  const isSavedCardJourney = cardJourney === "saved-card"

  return (
    <>
      <section className="flex flex-col gap-5">
        <div className="flex flex-col items-start gap-3 text-left">
          <Image
            src="/checkout-gateway/pay-in-4.svg"
            alt="Pay4"
            width={32}
            height={32}
            className="size-8"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold leading-6 text-foreground">
              {isSavedCardJourney
                ? "Pay4 with your saved card"
                : "Add a new credit card for Pay4 payment"}
            </h2>
            {isSavedCardJourney ? (
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Choose a saved card to split this purchase into four payments.
              </p>
            ) : null}
            {onChangePaymentMethod ? (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto justify-start px-0 py-0 text-sm font-semibold leading-6"
                onClick={onChangePaymentMethod}
              >
                Change method
              </Button>
            ) : null}
          </div>
        </div>

        {isSavedCardJourney ? (
          <SavedCardFields
            selectedCardId={selectedCardId}
            onSelectedCardChange={onSelectedCardChange}
          />
        ) : (
          <>
            <SupportedBanksList />
            <NewCardFields
              saveCard={saveCard}
              onSaveCardChange={setSaveCard}
            />
          </>
        )}
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

function SuccessConfetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden"
    >
      {successConfettiPieces.map((piece, index) => (
        <span
          key={`${piece.x}-${piece.y}-${index}`}
          className="success-confetti-piece absolute left-1/2 top-8 h-2.5 w-1.5 rounded-[2px]"
          style={
            {
              "--confetti-x": piece.x,
              "--confetti-y": piece.y,
              "--confetti-rotate": piece.rotate,
              animationDelay: piece.delay,
              backgroundColor: piece.color,
            } as CSSProperties
          }
        />
      ))}
      <style>{`
        @keyframes success-confetti {
          0% {
            opacity: 0;
            transform: translate3d(0, -12px, 0) rotate(0deg) scale(0.7);
          }
          15% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--confetti-x), var(--confetti-y), 0) rotate(var(--confetti-rotate)) scale(1);
          }
        }

        .success-confetti-piece {
          opacity: 0;
          animation: success-confetti 1400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .success-confetti-piece {
            animation: none;
            opacity: 0.7;
            transform: translate3d(var(--confetti-x), var(--confetti-y), 0) rotate(var(--confetti-rotate));
          }
        }
      `}</style>
    </div>
  )
}

function PaymentSuccessStep() {
  return (
    <>
      <section className="relative isolate flex min-h-[420px] flex-col items-center justify-center gap-5 overflow-visible text-center">
        <SuccessConfetti />
        <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="size-9" aria-hidden="true" />
        </div>
        <div className="relative z-10 flex max-w-sm flex-col items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Payment successful
          </h2>
        </div>
      </section>

      <CheckoutStepFooter>
        <Link
          href="/"
          className={cn(
            buttonVariants({
              size: "lg",
              className:
                "h-12 w-full rounded-full shadow-[var(--checkout-button-shadow)]",
            })
          )}
        >
          Buy other products
        </Link>
      </CheckoutStepFooter>
    </>
  )
}

export function PayInFourDemo({
  directPay4Entry = false,
}: {
  directPay4Entry?: boolean
}) {
  const router = useRouter()
  const { hydrated, items, subtotal } = useCart()
  const { merchantOfferEnabled } = usePayInFourTheme()
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address")
  const [highestStepIndex, setHighestStepIndex] = useState(0)
  const [selectedAddressId, setSelectedAddressId] = useState("product-office")
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("pay-in-4")
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("methods")
  const [hasHandledDirectPay4Entry, setHasHandledDirectPay4Entry] =
    useState(false)
  const [selectedSavedCardId, setSelectedSavedCardId] = useState(
    defaultSavedPayInFourCard.id
  )
  const order = useMemo(
    () => createCheckoutOrderFromCart(items, merchantOfferEnabled),
    [items, merchantOfferEnabled]
  )
  const paymentMethods = useMemo(() => createPaymentMethods(order), [order])
  const recommendedPaymentMethods = useMemo(
    () => paymentMethods.filter((method) => method.value === "pay-in-4"),
    [paymentMethods]
  )
  const otherPaymentMethods = useMemo(
    () => paymentMethods.filter((method) => method.value !== "pay-in-4"),
    [paymentMethods]
  )
  const isPaymentSuccess = checkoutStep === "pay" && paymentStage === "success"
  const isPayInFourOfferActive =
    order.pay4Eligible &&
    paymentMethod === "pay-in-4" &&
    checkoutStep === "pay"
  const payInFourInstallments = useMemo(
    () => splitInstallments(order.payInFourTotal),
    [order.payInFourTotal]
  )
  const checkoutAmount = isPayInFourOfferActive
    ? order.payInFourTotal
    : order.total
  const checkoutDiscountAmount = isPayInFourOfferActive
    ? order.payInFourDiscountAmount
    : 0
  const pay4Breakdown = useMemo(
    () => (order.pay4Eligible ? createPay4BreakdownDisplay(order) : undefined),
    [order]
  )

  const dueToday =
    paymentMethod === "pay-in-4"
      ? payInFourInstallments[0]
      : paymentMethod === "bnpl"
        ? 0
      : order.total

  const submitLabel =
    paymentMethod === "pay-in-4"
      ? "Continue with Pay4"
      : paymentMethod === "upi"
        ? "Pay with UPI"
        : paymentMethod === "emi"
          ? "Continue EMI"
          : paymentMethod === "bnpl"
            ? "Continue BNPL"
            : paymentMethod === "wallet"
              ? "Pay with Wallet"
              : "Pay Netbanking"

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart")
    }
  }, [hydrated, items.length, router])

  useEffect(() => {
    if (!order.pay4Eligible && paymentMethod === "pay-in-4") {
      setPaymentMethod("upi")
    }
  }, [order.pay4Eligible, paymentMethod])

  useEffect(() => {
    if (
      !hydrated ||
      hasHandledDirectPay4Entry ||
      !directPay4Entry ||
      items.length === 0 ||
      !order.pay4Eligible
    ) {
      return
    }

    setCheckoutStep("pay")
    setHighestStepIndex(1)
    setPaymentMethod("pay-in-4")
    setPaymentStage("card")
    setHasHandledDirectPay4Entry(true)
  }, [
    directPay4Entry,
    hasHandledDirectPay4Entry,
    hydrated,
    items.length,
    order.pay4Eligible,
  ])

  if (!hydrated || items.length === 0) {
    return null
  }

  function handleStepSelect(step: CheckoutStep) {
    const stepIndex = getStepIndex(step)

    if (stepIndex <= highestStepIndex) {
      setCheckoutStep(step)
      setPaymentStage("methods")
    }
  }

  function completePayment() {
    setPaymentStage("success")
  }

  function handleChangePaymentMethod() {
    setCheckoutStep("pay")
    setPaymentMethod(order.pay4Eligible ? "pay-in-4" : "upi")
    setPaymentStage("methods")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (checkoutStep === "address") {
      setHighestStepIndex((current) => Math.max(current, 1))
      setCheckoutStep("pay")

      setPaymentStage("methods")
      return
    }

    if (checkoutStep === "pay" && paymentStage === "methods") {
      if (paymentMethod === "pay-in-4") {
        setPaymentStage("card")
        return
      }

      completePayment()
      return
    }

    if (checkoutStep === "pay" && paymentStage === "card") {
      completePayment()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FigmaCheckoutBar
        currentStep={checkoutStep}
        highestStepIndex={highestStepIndex}
        onStepSelect={handleStepSelect}
      />
      {!isPaymentSuccess ? (
        <CheckoutOrderHeader
          amount={checkoutAmount}
          discountAmount={checkoutDiscountAmount}
          merchantOfferLabel={order.merchantOffer?.label}
          mrp={order.mrp}
          pay4Eligible={order.pay4Eligible}
          pay4Breakdown={pay4Breakdown}
          subtotal={checkoutAmount}
          productHref="/cart"
        />
      ) : null}
      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:px-6 md:py-6">
        {!isPaymentSuccess && !order.pay4Eligible ? (
          <section className="mb-4">
            <Pay4EligibilityProgress currentAmount={subtotal} />
          </section>
        ) : null}
        <section className="flex min-w-0 flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {checkoutStep === "address" ? (
              <AddressStep
                selectedAddressId={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
                productHref="/cart"
                continueLabel="Continue to pay"
              />
            ) : null}

            {checkoutStep === "pay" && paymentStage === "methods" ? (
              <>
                {recommendedPaymentMethods.length > 0 ? (
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
                                  meta={
                                    method.value === "pay-in-4" ? (
                                      <SupportedBanksList compact />
                                    ) : undefined
                                  }
                                  badge={method.badge}
                                  offer={method.offer}
                                  icon={method.icon}
                                  iconSrc={method.iconSrc}
                                  selected={paymentMethod === method.value}
                                />
                              </div>
                            ))}
                          </RadioGroup>
                        </FieldSet>
                      </CardContent>
                    </Card>
                  </section>
                ) : null}

                <section className="flex flex-col gap-2">
                  <h2 className="text-base font-semibold leading-6">
                    {recommendedPaymentMethods.length > 0
                      ? "Other payment methods"
                      : "Payment methods"}
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
                                    badge={method.badge}
                                    offer={method.offer}
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
                selectedCardId={selectedSavedCardId}
                onSelectedCardChange={setSelectedSavedCardId}
                onChangePaymentMethod={handleChangePaymentMethod}
                onBack={() => {
                  setPaymentStage("methods")
                }}
              />
            ) : null}

            {checkoutStep === "pay" && paymentStage === "success" ? (
              <PaymentSuccessStep />
            ) : null}
          </form>
        </section>

      </main>
    </div>
  )
}
