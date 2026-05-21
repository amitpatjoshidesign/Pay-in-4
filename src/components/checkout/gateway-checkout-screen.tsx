import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Languages,
  Signal,
  Wifi,
} from "lucide-react"
import type { ReactNode } from "react"

import {
  createCheckoutOrder,
  formatCurrency,
  type Product,
} from "@/data/checkout"

type GatewayCheckoutScreenProps = {
  product: Product
}

type PaymentRow = {
  title: string
  description: string
  icon: string
  offer?: string
}

const gatewayAssets = {
  lock: "/checkout-gateway/lock.svg",
  payIn4: "/checkout-gateway/pay-in-4.svg",
  upi: "/checkout-gateway/upi.svg",
  emi: "/checkout-gateway/emi.svg",
  bnpl: "/checkout-gateway/bnpl.svg",
  wallets: "/checkout-gateway/wallets.svg",
  netbanking: "/checkout-gateway/netbanking.svg",
  securePayments: "/checkout-gateway/secure-payments.svg",
  pciDss: "/checkout-gateway/pci-dss.svg",
  pineLabsOnline: "/checkout-gateway/pine-labs-online.svg",
}

export function GatewayCheckoutScreen({ product }: GatewayCheckoutScreenProps) {
  const order = createCheckoutOrder(product)
  const installmentAmount = order.total / 4
  const monthlyEmi = Math.ceil(order.total / 12)
  const paymentRows: PaymentRow[] = [
    {
      title: "UPI",
      description: "PhonePe, GooglePay, PayTM, CRED & more",
      icon: gatewayAssets.upi,
    },
    {
      title: "EMI",
      description: `Credit, Debit & Cardless EMIs from ${formatCurrency(monthlyEmi)} per month`,
      icon: gatewayAssets.emi,
      offer: "Save ₹5,000",
    },
    {
      title: "Buy Now Pay Later",
      description: "Lazypay, Simpl and HDFC",
      icon: gatewayAssets.bnpl,
    },
    {
      title: "Wallets",
      description: "Jio, Airtel, PayTM, Mobikwik & more",
      icon: gatewayAssets.wallets,
    },
    {
      title: "Netbanking",
      description: "Pay by scanning a QR code with any banking app",
      icon: gatewayAssets.netbanking,
    },
  ]

  return (
    <main className="min-h-screen bg-[#f4f4f4] text-[#1c1c1c]">
      <div className="mx-auto min-h-screen w-full max-w-[428px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.16)]">
        <GatewayBrowserHeader />
        <GatewayStepNav />
        <GatewayOrderHeader
          amount={formatCurrency(order.total)}
          merchant={order.merchant}
          productHref={product.href}
        />

        <section className="flex flex-col gap-7 px-6 py-6">
          <PaymentSection title="Pay 4">
            <GatewayPaymentRow
              title="Pay in 4"
              description={`${formatCurrency(installmentAmount)} today, then every 2 weeks`}
              icon={gatewayAssets.payIn4}
              href={`/checkout/classic?product=${product.slug}`}
              standalone
            />
          </PaymentSection>

          <PaymentSection title="More Payment Options">
            <div className="overflow-hidden rounded-[12px] border border-[rgba(28,28,28,0.08)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              {paymentRows.map((row, index) => (
                <GatewayPaymentRow
                  key={row.title}
                  title={row.title}
                  description={row.description}
                  icon={row.icon}
                  offer={row.offer}
                  withDivider={index < paymentRows.length - 1}
                />
              ))}
            </div>
          </PaymentSection>

          <GatewayFooter />
        </section>
      </div>
    </main>
  )
}

function GatewayBrowserHeader() {
  return (
    <header className="border-b border-[#f0f0f0] bg-[#fafafa]">
      <div className="flex h-[54px] items-end justify-between px-[62px] pb-2">
        <p className="text-[17px] font-black leading-[22px] tracking-[-0.02em]">
          9:41
        </p>
        <div className="flex items-center gap-1.5 text-black">
          <Signal className="size-4 fill-current" aria-hidden="true" />
          <Wifi className="size-4" aria-hidden="true" />
          <div className="h-3 w-6 rounded-[4px] border-2 border-black p-px">
            <div className="h-full w-4 rounded-[2px] bg-black" />
          </div>
        </div>
      </div>
      <div className="flex h-12 items-center justify-center gap-1.5 text-[13px] tracking-[-0.004em] text-[#aeb4ba]">
        <Image
          src={gatewayAssets.lock}
          alt=""
          width={8}
          height={12}
          className="h-3 w-2"
        />
        gateway.plural.com
      </div>
    </header>
  )
}

function GatewayStepNav() {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-[#f0f0f0] bg-white px-6">
      <div className="flex items-center gap-3 text-[14px] font-semibold tracking-[0.02em]">
        <span>Contact</span>
        <span className="text-[rgba(28,28,28,0.6)]">»</span>
        <span>Address</span>
        <span className="text-[rgba(28,28,28,0.6)]">»</span>
        <span className="rounded-[8px] bg-[#eaedf0] px-2 py-1">Pay</span>
      </div>
      <button
        type="button"
        className="flex h-8 w-14 items-center justify-center gap-1 rounded-[12px] border border-[rgba(28,28,28,0.12)] bg-white"
        aria-label="Change language"
      >
        <Languages className="size-4" aria-hidden="true" />
        <ChevronDown className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

function GatewayOrderHeader({
  amount,
  merchant,
  productHref,
}: {
  amount: string
  merchant: string
  productHref: string
}) {
  return (
    <section className="relative h-[140px] bg-[#003323] px-6 py-4 text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-[13px] font-bold text-[#003323]">
            {merchant.charAt(0)}
          </div>
          <p className="text-[13px] font-medium">{merchant}</p>
        </div>
        <Link
          href={productHref}
          className="flex size-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.24)]"
          aria-label="Close checkout"
        >
          <span className="text-xl leading-none text-white/80">×</span>
        </Link>
      </div>
      <div className="mt-7">
        <p className="text-[32px] font-semibold leading-10 tracking-[0.02em]">
          {amount}
        </p>
        <button
          type="button"
          className="mt-1 flex items-center gap-1 text-[14px] font-medium capitalize leading-6 tracking-[0.04em]"
        >
          Order Summary
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

function PaymentSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-2 text-[13px] font-bold uppercase leading-none tracking-[0.12em] text-[rgba(28,28,28,0.6)]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function GatewayPaymentRow({
  title,
  description,
  icon,
  offer,
  href,
  standalone,
  withDivider,
}: PaymentRow & {
  href?: string
  standalone?: boolean
  withDivider?: boolean
}) {
  const content = (
    <div
      className={[
        "relative flex h-20 items-center gap-3 bg-white px-4",
        standalone
          ? "rounded-[12px] border border-[rgba(28,28,28,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          : "",
      ].join(" ")}
    >
      <Image
        src={icon}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[16px] font-bold leading-5">{title}</p>
          {offer ? (
            <span className="shrink-0 rounded-[4px] bg-[#ddf6e9] px-2 py-1 text-[13px] font-bold leading-4 text-[rgba(0,114,47,0.8)]">
              {offer}
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate text-[13px] font-semibold leading-normal text-[rgba(28,28,28,0.5)]">
          {description}
        </p>
      </div>
      <ChevronRight
        className="size-5 shrink-0 text-[rgba(28,28,28,0.72)]"
        aria-hidden="true"
      />
      {withDivider ? (
        <div className="absolute bottom-0 left-4 right-4 h-px bg-[rgba(28,28,28,0.08)]" />
      ) : null}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return (
    <button type="button" className="block w-full text-left">
      {content}
    </button>
  )
}

function GatewayFooter() {
  return (
    <footer className="flex h-16 items-start justify-between px-4 pt-1 text-[#1c1c1c] opacity-60">
      <div className="flex items-start gap-1">
        <Image
          src={gatewayAssets.securePayments}
          alt=""
          width={24}
          height={24}
          className="mt-px size-6"
        />
        <div className="whitespace-nowrap">
          <p className="text-[11px] font-extrabold leading-[14px]">
            Safe & Secure
          </p>
          <p className="text-[8px] font-bold leading-2">Payments</p>
        </div>
      </div>
      <div className="h-4 w-px bg-[#1c1c1c]/40" />
      <Image
        src={gatewayAssets.pciDss}
        alt="PCI DSS"
        width={42}
        height={16}
        className="h-4 w-auto"
      />
      <Image
        src={gatewayAssets.pineLabsOnline}
        alt="Pine Labs Online"
        width={72}
        height={28}
        className="h-7 w-auto"
      />
    </footer>
  )
}
