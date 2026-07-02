"use client"

import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, ShoppingCart, X } from "lucide-react"

import { CartButton } from "@/components/cart/cart-button"
import { useCart } from "@/components/cart/cart-context"
import {
  PayInFourThemePopover,
  usePayInFourTheme,
} from "@/components/pay-in-four-theme"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { ProductBrand } from "@/components/product/product-brand"
import { ActionToast } from "@/components/ui/action-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  createCheckoutOrder,
  formatCurrency,
  getPayInFourOfferTotal,
  isPay4Eligible,
  products,
  splitInstallments,
  type Product,
} from "@/data/checkout"

export function ProductLanding() {
  const router = useRouter()
  const { merchantOfferEnabled } = usePayInFourTheme()
  const { items, addItem } = useCart()
  const [explainerProduct, setExplainerProduct] = useState<Product | null>(null)
  const [toastProductName, setToastProductName] = useState<string | null>(null)

  function handleAddToCart(product: Product) {
    addItem(product)
    setToastProductName(product.name)
  }

  function handlePay4BuyNow(product: Product) {
    const isInCart = items.some((item) => item.product.id === product.id)

    if (!isInCart) {
      flushSync(() => {
        addItem(product)
      })
    }

    setExplainerProduct(null)
    router.push("/checkout?entry=pay4")
  }

  useEffect(() => {
    if (!explainerProduct) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExplainerProduct(null)
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [explainerProduct])

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

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item, index) => {
            const payInFourTotal = getPayInFourOfferTotal(
              item,
              merchantOfferEnabled
            )

            return (
              <Card
                key={item.id}
                className="group relative h-full overflow-hidden rounded-[calc(var(--radius)*1.2)] border-border bg-background p-0 ring-0 shadow-[var(--checkout-soft-shadow)] transition-shadow hover:shadow-[var(--checkout-shadow)]"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-3 top-3 z-10 size-10 rounded-lg border-black/8 bg-white/92 text-black backdrop-blur hover:border-black/12 hover:bg-white hover:text-black"
                  aria-label={`Add ${item.name} to cart`}
                  onClick={() => handleAddToCart(item)}
                >
                  <span className="relative">
                    <ShoppingCart aria-hidden="true" />
                    <Plus
                      aria-hidden="true"
                      strokeWidth={2}
                      className="absolute -right-1 -top-1 size-3.5 rounded-full bg-white"
                    />
                  </span>
                </Button>
                <Link
                  href={item.href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View ${item.name}`}
                >
                  <CardContent className="p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        priority={index < 2}
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="gap-3 pt-0">
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2">
                      <div className="min-w-0">
                        <CardTitle className="truncate text-lg">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {item.subtitle}
                        </CardDescription>
                      </div>
                      <p className="shrink-0 text-lg font-semibold tabular-nums">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </CardHeader>
                </Link>
                <div className="px-4 pb-4">
                  {isPay4Eligible(item) ? (
                    <div className="flex min-w-0 flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="shrink-0 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-haspopup="dialog"
                        aria-expanded={explainerProduct?.id === item.id}
                        aria-label={`Learn about Pay4 for ${item.name}`}
                        onClick={() => setExplainerProduct(item)}
                      >
                        <PayInFourTag />
                      </button>
                      {merchantOfferEnabled && item.merchantOffer ? (
                        <Badge className="h-6 shrink-0 rounded-[8px] bg-emerald-50 px-2 text-[10px] font-bold leading-none text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50">
                          {item.merchantOffer.value}% off
                        </Badge>
                      ) : null}
                      <p className="min-w-0 text-sm font-medium text-primary">
                        Pay in 4 monthly installments of {formatCurrency(splitInstallments(payInFourTotal)[0])}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <p className="text-sm text-muted-foreground">
                        Add items to cart to unlock Pay4 above {formatCurrency(5000)}.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {toastProductName ? (
        <ActionToast
          title={`${toastProductName} added to cart`}
          actionHref="/cart"
          actionLabel="Go to cart"
          onDismiss={() => setToastProductName(null)}
        />
      ) : null}

      <PayInFourBottomSheet
        product={explainerProduct}
        onBuyNowWithPay4={handlePay4BuyNow}
        onClose={() => setExplainerProduct(null)}
      />
    </main>
  )
}

function PayInFourTag() {
  return (
    <Badge
      className="h-6 gap-1.5 rounded-[8px] pl-1 pr-1.5 text-[10px] font-bold italic leading-none tracking-[0.01em] text-white ring-1 ring-white/35"
      style={{
        background: "var(--pay-in-four-badge-gradient)",
        borderColor: "var(--pay-in-four-badge-border)",
        boxShadow: "var(--pay-in-four-badge-shadow)",
      }}
    >
      <PineArrowMark />
      Pay4
    </Badge>
  )
}

function PineArrowMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-3 shrink-0 text-white"
      viewBox="0 0 10 10"
      fill="currentColor"
    >
      <path d="M0.98 3.94 4.67.27h5.2v5.2L6.2 9.14V3.94H.98Z" />
    </svg>
  )
}

function PayInFourBottomSheet({
  product,
  onBuyNowWithPay4,
  onClose,
}: {
  product: Product | null
  onBuyNowWithPay4: (product: Product) => void
  onClose: () => void
}) {
  if (!product) {
    return null
  }

  const { merchantOfferEnabled } = usePayInFourTheme()
  const order = createCheckoutOrder(product, merchantOfferEnabled)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-foreground/35"
        aria-label="Close Pay4 explainer"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-in-four-sheet-title"
        className="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col gap-4 rounded-t-[calc(var(--radius)*2)] border border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgb(0_0_0_/_18%)]"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="pay-in-four-sheet-title"
              className="text-xl font-bold tracking-tight"
            >
              Pay4 available
            </h2>
            {order.merchantOffer ? (
              <p className="mt-2 inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {order.merchantOffer.value}% off on MRP
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label="Close Pay4 explainer"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <PayInFourWidget
            total={order.payInFourTotal}
            originalTotal={order.total}
            defaultExpanded
            embedded
            offerPercent={order.merchantOffer?.value}
            onDirectCheckout={() => onBuyNowWithPay4(product)}
            supportingContent={
              <div className="flex items-center">
                {supportedBanks.map((bank, index) => (
                  <div
                    key={bank.name}
                    className="flex size-8 min-w-0 items-center justify-center rounded-full border bg-white p-1.5"
                    style={{
                      marginLeft: index > 0 ? "-4px" : undefined,
                      borderColor: "var(--pay-in-four-surface)",
                    }}
                  >
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      width={48}
                      height={20}
                      className="max-h-3.5 max-w-6 object-contain"
                    />
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </section>
    </div>
  )
}

const supportedBanks = [
  { name: "ICICI Bank", logo: "/bank-logos/icici.svg" },
  { name: "SBI", logo: "/bank-logos/sbi.svg" },
  { name: "Axis Bank", logo: "/bank-logos/axis.svg" },
  { name: "Kotak", logo: "/bank-logos/kotak.svg" },
  { name: "HDFC Bank", logo: "/bank-logos/hdfc.svg" },
]
