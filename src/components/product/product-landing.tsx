"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, X } from "lucide-react"

import { PayInFourThemePopover } from "@/components/pay-in-four-theme"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { ProductBrand } from "@/components/product/product-brand"
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
  defaultProduct,
  formatCurrency,
  getPayInFourOfferTotal,
  products,
  splitInstallments,
  type Product,
} from "@/data/checkout"

export function ProductLanding() {
  const [explainerProduct, setExplainerProduct] = useState<Product | null>(null)

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
            <Button
              render={
                <Link
                  href={`/checkout?product=${defaultProduct.slug}`}
                  aria-label="Checkout"
                />
              }
              variant="outline"
              size="icon"
              nativeButton={false}
            >
              <ShoppingCart aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item, index) => {
            const payInFourTotal = getPayInFourOfferTotal(item)

            return (
              <Card
                key={item.id}
                className="group h-full overflow-hidden rounded-[calc(var(--radius)*1.2)] border-border bg-background p-0 ring-0 shadow-[var(--checkout-soft-shadow)] transition-shadow hover:shadow-[var(--checkout-shadow)]"
              >
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
                {item.payInFourEligible ? (
                  <div className="px-4 pb-4">
                    <div className="flex min-w-0 items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="shrink-0 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-haspopup="dialog"
                        aria-expanded={explainerProduct?.id === item.id}
                        aria-label={`Learn about Pay in 4 for ${item.name}`}
                        onClick={() => setExplainerProduct(item)}
                      >
                        <PayInFourTag />
                      </button>
                      <p className="min-w-0 text-sm font-medium text-primary">
                        4 payments of{" "}
                        {formatCurrency(splitInstallments(payInFourTotal)[0])}{" "}
                        monthly
                      </p>
                    </div>
                  </div>
                ) : null}
              </Card>
            )
          })}
        </div>
      </section>

      <PayInFourBottomSheet
        product={explainerProduct}
        onClose={() => setExplainerProduct(null)}
      />
    </main>
  )
}

function PayInFourTag() {
  return (
    <Badge
      className="h-6 gap-1.5 rounded-[8px] pl-1 pr-1.5 text-[10px] font-bold italic leading-none text-white ring-1 ring-white/35"
      style={{
        background: "var(--pay-in-four-badge-gradient)",
        borderColor: "var(--pay-in-four-badge-border)",
        boxShadow: "var(--pay-in-four-badge-shadow)",
      }}
    >
      <PineArrowMark />
      Pay in 4
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
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  if (!product) {
    return null
  }

  const order = createCheckoutOrder(product)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-foreground/35"
        aria-label="Close Pay in 4 explainer"
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
            <p className="text-sm font-medium text-muted-foreground">
              {product.name}
            </p>
            <h2
              id="pay-in-four-sheet-title"
              className="text-xl font-bold tracking-tight"
            >
              Pay in 4 available
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label="Close Pay in 4 explainer"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Split this purchase into four interest-free payments. Pay the first
          part today, then the remaining three payments monthly.
        </p>

        <div className="flex flex-col gap-3">
          <PayInFourWidget
            total={order.payInFourTotal}
            originalTotal={order.total}
            defaultExpanded
            embedded
            offerPercent={product.merchantOffer?.value}
            directCheckoutHref={`/checkout?product=${product.slug}&direct=pay-in-4`}
          />
        </div>
      </section>
    </div>
  )
}
