"use client"

import { useState } from "react"
import { flushSync } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  CircleCheck,
  Ruler,
  Sofa,
} from "lucide-react"

import { CartButton } from "@/components/cart/cart-button"
import { useCart } from "@/components/cart/cart-context"
import { PayInFourThemePopover } from "@/components/pay-in-four-theme"
import { usePayInFourTheme } from "@/components/pay-in-four-theme"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { ProductBrand } from "@/components/product/product-brand"
import { ActionToast } from "@/components/ui/action-toast"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  createCheckoutOrder,
  formatCurrency,
  type Product,
} from "@/data/checkout"

const specIcons = [Sofa, Armchair, Ruler]

const compactFeatureLabels: Record<string, string> = {
  "Three-seat frame": "3-seat frame",
  "Ivory boucle upholstery": "Boucle fabric",
  "Rounded comfort arms": "Rounded arms",
  "Natural oak legs": "Oak legs",
  "Compact two-seat frame": "2-seat frame",
  "Sage performance linen": "Linen fabric",
  "Squared seat cushions": "Squared cushions",
  "Matte black sled legs": "Sled legs",
  "Scheduled delivery included": "Delivery included",
  "Right-facing chaise": "Right chaise",
  "Curved sectional frame": "Curved frame",
  "Sand performance fabric": "Sand fabric",
  "Low rounded back": "Low back",
  "Modular three-seat frame": "Modular frame",
  "Charcoal woven fabric": "Woven fabric",
  "Loose back cushions": "Loose cushions",
  "Walnut block legs": "Walnut legs",
  "Compact loveseat frame": "Loveseat frame",
  "Terracotta velvet upholstery": "Velvet fabric",
  "Gently curved back": "Curved back",
  "Tapered brass legs": "Brass legs",
}

const supportedBanks = [
  { name: "ICICI Bank", logo: "/bank-logos/icici.svg" },
  { name: "SBI", logo: "/bank-logos/sbi.svg" },
  { name: "Axis Bank", logo: "/bank-logos/axis.svg" },
  { name: "Kotak", logo: "/bank-logos/kotak.svg" },
  { name: "HDFC Bank", logo: "/bank-logos/hdfc.svg" },
]

type ProductDetailProps = {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const { merchantOfferEnabled } = usePayInFourTheme()
  const { items, addItem } = useCart()
  const [showCartToast, setShowCartToast] = useState(false)
  const order = createCheckoutOrder(product, merchantOfferEnabled)
  const productHighlights = product.features.slice(0, 4)
  const isInCart = items.some((item) => item.product.id === product.id)

  function handleAddToCart() {
    addItem(product)
    setShowCartToast(true)
  }

  function handleBuyNow() {
    if (!isInCart) {
      addItem(product)
    }

    router.push("/checkout")
  }

  function handlePay4BuyNow() {
    if (!isInCart) {
      flushSync(() => {
        addItem(product)
      })
    }

    router.push("/checkout?entry=pay4")
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-4 md:px-6">
          <Button
            render={<Link href="/" aria-label="Products" />}
            variant="ghost"
            size="icon"
            className="absolute left-4 md:left-6"
            nativeButton={false}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <ProductBrand />
          <div className="absolute right-4 flex items-center gap-2 md:right-6">
            <CartButton />
            <PayInFourThemePopover />
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:px-6 md:pb-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <Card className="rounded-[calc(var(--radius)*1.5)] border-border ring-0 shadow-none">
            <CardContent className="p-4">
              <div className="relative h-56 overflow-hidden rounded-[calc(var(--radius)*1.2)] bg-background md:aspect-square md:h-auto">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {product.subtitle}
                </p>
                <p className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {formatCurrency(order.total)}
                </p>
                <p className="mt-3 max-w-xl line-clamp-3 text-base leading-6 text-muted-foreground">
                  {product.longDescription}
                </p>
              </div>
            </div>

            {order.pay4Eligible ? (
              <PayInFourWidget
                total={order.payInFourTotal}
                originalTotal={order.total}
                offerPercent={order.merchantOffer?.value}
                onDirectCheckout={handlePay4BuyNow}
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
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              {productHighlights.map((feature, index) => {
                const Icon = specIcons[index] ?? CircleCheck

                return (
                  <div
                    key={feature}
                    className="min-w-0 rounded-[var(--radius)] border bg-background p-3"
                  >
                    <Icon
                      className="mb-3 size-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="truncate text-sm font-medium">
                      {compactFeatureLabels[feature] ?? feature}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {showCartToast ? (
        <ActionToast
          title={`${product.name} added to cart`}
          actionHref="/cart"
          actionLabel="Go to cart"
          onDismiss={() => setShowCartToast(false)}
        />
      ) : null}

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(18,23,21,0.12)] md:static md:border-t-0 md:pt-0 md:shadow-none">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 md:px-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 flex-1 rounded-full px-5"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
          <Button
            type="button"
            size="lg"
            className="h-12 flex-1 rounded-full px-5 shadow-[var(--checkout-button-shadow)]"
            onClick={handleBuyNow}
          >
            Buy now
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </footer>
    </main>
  )
}
