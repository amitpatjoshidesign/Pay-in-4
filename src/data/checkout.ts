import {
  Building2,
  CalendarDays,
  CreditCard,
  Landmark,
  Smartphone,
  WalletCards,
  type LucideIcon,
} from "lucide-react"

export type PaymentMethod =
  | "pay-in-4"
  | "upi"
  | "emi"
  | "bnpl"
  | "wallet"
  | "netbanking"

export type MerchantOffer = {
  type: "percent"
  value: number
  label: string
}

export type Product = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  longDescription: string
  image: string
  price: number
  merchantOffer?: MerchantOffer
  href: string
  payInFourEligible?: boolean
  features: string[]
  specs: Array<{
    label: string
    value: string
  }>
}

export type CheckoutOrder = {
  merchant: string
  itemName: string
  itemDescription: string
  mrp: number
  merchantOffer?: MerchantOffer
  payInFourDiscountAmount: number
  payInFourTotal: number
  subtotal: number
  delivery: number
  gst: number
  protection: number
  total: number
}

export type PaymentMethodOption = {
  id: string
  value: PaymentMethod
  title: string
  description: string
  detail: string
  badge?: string
  offer?: string
  icon: LucideIcon
  iconSrc?: string
}

export type Installment = {
  label: string
  date: string
  amount: number
  status: string
  icon: LucideIcon
}

export const products: Product[] = [
  {
    id: "marlow-boucle-sofa",
    slug: "marlow-boucle-sofa",
    name: "Marlow Boucle Sofa",
    subtitle: "Ivory boucle · 3-seat sofa",
    description: "Rounded ivory sofa with plush cushions and oak legs.",
    longDescription:
      "A low-profile three-seat sofa with warm ivory boucle upholstery, rounded arms, plush block cushions, and slim natural oak legs.",
    image: "/products/marlow-boucle-sofa.png",
    price: 89999,
    merchantOffer: {
      type: "percent",
      value: 10,
      label: "10% off on MRP",
    },
    href: "/product/marlow-boucle-sofa",
    payInFourEligible: true,
    features: [
      "Three-seat frame",
      "Ivory boucle upholstery",
      "Rounded comfort arms",
      "Natural oak legs",
      "Room placement included",
    ],
    specs: [
      { label: "Seats", value: "3" },
      { label: "Fabric", value: "Boucle" },
      { label: "Feel", value: "Plush" },
    ],
  },
  {
    id: "arden-linen-sofa",
    slug: "arden-linen-sofa",
    name: "Arden Linen Sofa",
    subtitle: "Sage linen · 2-seat sofa",
    description: "Tailored compact sofa with clean lines and black sled legs.",
    longDescription:
      "A tailored two-seat sofa in sage performance linen with squared cushions, narrow arms, and matte black sled legs for smaller living spaces.",
    image: "/products/arden-linen-sofa.png",
    price: 74999,
    href: "/product/arden-linen-sofa",
    features: [
      "Compact two-seat frame",
      "Sage performance linen",
      "Squared seat cushions",
      "Matte black sled legs",
      "Scheduled delivery included",
    ],
    specs: [
      { label: "Seats", value: "2" },
      { label: "Fabric", value: "Linen" },
      { label: "Feel", value: "Tailored" },
    ],
  },
  {
    id: "cove-sectional-sofa",
    slug: "cove-sectional-sofa",
    name: "Cove Sectional Sofa",
    subtitle: "Sand fabric · Right chaise",
    description: "Curved sectional sofa with a low back and chaise lounge.",
    longDescription:
      "A soft sand sectional with a right-facing chaise, low rounded back, cloud-like cushions, and a hidden plinth base.",
    image: "/products/cove-sectional-sofa.png",
    price: 139999,
    href: "/product/cove-sectional-sofa",
    payInFourEligible: true,
    features: [
      "Right-facing chaise",
      "Curved sectional frame",
      "Sand performance fabric",
      "Low rounded back",
      "Room placement included",
    ],
    specs: [
      { label: "Seats", value: "4" },
      { label: "Fabric", value: "Performance" },
      { label: "Feel", value: "Cloud" },
    ],
  },
  {
    id: "rowan-modular-sofa",
    slug: "rowan-modular-sofa",
    name: "Rowan Modular Sofa",
    subtitle: "Charcoal weave · Modular sofa",
    description: "Deep charcoal sofa with loose cushions and walnut legs.",
    longDescription:
      "A modern modular three-seat sofa in charcoal woven performance fabric with broad low arms, loose back cushions, and walnut block legs.",
    image: "/products/rowan-modular-sofa.png",
    price: 119999,
    href: "/product/rowan-modular-sofa",
    features: [
      "Modular three-seat frame",
      "Charcoal woven fabric",
      "Loose back cushions",
      "Walnut block legs",
      "Scheduled delivery included",
    ],
    specs: [
      { label: "Seats", value: "3" },
      { label: "Fabric", value: "Woven" },
      { label: "Feel", value: "Deep" },
    ],
  },
  {
    id: "terra-velvet-loveseat",
    slug: "terra-velvet-loveseat",
    name: "Terra Velvet Loveseat",
    subtitle: "Terracotta velvet · Compact loveseat",
    description: "Compact curved loveseat with brass legs and velvet finish.",
    longDescription:
      "A compact loveseat in terracotta velvet with a gently curved back, rounded arms, two seat cushions, and tapered brass legs.",
    image: "/products/terra-loveseat.png",
    price: 64999,
    href: "/product/terra-velvet-loveseat",
    features: [
      "Compact loveseat frame",
      "Terracotta velvet upholstery",
      "Gently curved back",
      "Tapered brass legs",
      "Scheduled delivery included",
    ],
    specs: [
      { label: "Seats", value: "2" },
      { label: "Fabric", value: "Velvet" },
      { label: "Feel", value: "Compact" },
    ],
  },
]

export const defaultProduct = products[0]

export function getProductBySlug(slug?: string) {
  return products.find((item) => item.slug === slug)
}

export function getPayInFourOfferDiscount(product: Product) {
  if (!product.merchantOffer) {
    return 0
  }

  if (product.merchantOffer.type === "percent") {
    return Math.round((product.price * product.merchantOffer.value) / 100)
  }

  return 0
}

export function getPayInFourOfferTotal(product: Product) {
  return product.price - getPayInFourOfferDiscount(product)
}

export function createCheckoutOrder(product: Product): CheckoutOrder {
  const payInFourDiscountAmount = getPayInFourOfferDiscount(product)
  const payInFourTotal = product.price - payInFourDiscountAmount

  return {
    merchant: "Luma Home",
    itemName: product.name,
    itemDescription: product.subtitle,
    mrp: product.price,
    merchantOffer: product.merchantOffer,
    payInFourDiscountAmount,
    payInFourTotal,
    subtotal: product.price,
    delivery: 0,
    gst: 0,
    protection: 0,
    total: product.price,
  }
}

export function splitInstallments(total: number) {
  const baseAmount = Math.floor(total / 4)
  const remainder = total - baseAmount * 4

  return Array.from({ length: 4 }, (_, index) =>
    baseAmount + (index < remainder ? 1 : 0)
  )
}

export function createPaymentMethods(
  order: CheckoutOrder
): PaymentMethodOption[] {
  const installmentAmount = splitInstallments(order.payInFourTotal)[0]

  return [
    {
      id: "payment-pay-in-4",
      value: "pay-in-4",
      title: "Pay in 4",
      description: "Split the purchase into four interest-free payments.",
      detail: `${formatCurrency(installmentAmount)} today, then monthly`,
      badge: "Recommended",
      offer:
        order.payInFourDiscountAmount > 0 && order.merchantOffer
          ? `${order.merchantOffer.value}% off`
          : undefined,
      icon: Landmark,
      iconSrc: "/checkout-gateway/pay-in-4.svg",
    },
    {
      id: "payment-upi",
      value: "upi",
      title: "UPI",
      description: "PhonePe, Google Pay, Paytm, CRED and more.",
      detail: `Due today: ${formatCurrency(order.total)}`,
      icon: Smartphone,
      iconSrc: "/payment-methods/upi.svg",
    },
    {
      id: "payment-emi",
      value: "emi",
      title: "EMI",
      description: "Credit, debit and cardless EMI options.",
      detail: `Plans from ${formatCurrency(Math.ceil(order.total / 12))}/month`,
      icon: CreditCard,
      iconSrc: "/payment-methods/emi.svg",
    },
    {
      id: "payment-bnpl",
      value: "bnpl",
      title: "Buy Now Pay Later",
      description: "LazyPay, Simpl, HDFC and more.",
      detail: "Pay later after provider approval",
      icon: CalendarDays,
      iconSrc: "/payment-methods/bnpl.svg",
    },
    {
      id: "payment-wallet",
      value: "wallet",
      title: "Wallets",
      description: "JioMoney, Airtel Money, Paytm, MobiKwik and more.",
      detail: `Due today: ${formatCurrency(order.total)}`,
      icon: WalletCards,
      iconSrc: "/payment-methods/wallets.svg",
    },
    {
      id: "payment-netbanking",
      value: "netbanking",
      title: "Netbanking",
      description: "Pay from supported Indian bank accounts.",
      detail: `Due today: ${formatCurrency(order.total)}`,
      icon: Building2,
      iconSrc: "/payment-methods/netbanking.svg",
    },
  ]
}

export function createInstallments(total: number): Installment[] {
  const installmentAmount = total / 4

  return [
    {
      label: "Payment 1",
      date: "At checkout",
      amount: installmentAmount,
      status: "Due now",
      icon: CalendarDays,
    },
    {
      label: "Payment 2",
      date: "2 weeks later",
      amount: installmentAmount,
      status: "Scheduled",
      icon: CalendarDays,
    },
    {
      label: "Payment 3",
      date: "4 weeks later",
      amount: installmentAmount,
      status: "Scheduled",
      icon: CalendarDays,
    },
    {
      label: "Payment 4",
      date: "6 weeks later",
      amount: installmentAmount,
      status: "Scheduled",
      icon: CalendarDays,
    },
  ]
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)
