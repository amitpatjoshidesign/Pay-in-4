import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  CircleCheck,
  Ruler,
  Sofa,
} from "lucide-react"

import { PayInFourThemePopover } from "@/components/pay-in-four-theme"
import { PayInFourWidget } from "@/components/product/pay-in-four-widget"
import { ProductBrand } from "@/components/product/product-brand"
import { Button } from "@/components/ui/button"
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

type ProductDetailProps = {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const order = createCheckoutOrder(product)
  const productHighlights = product.features.slice(0, 4)

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
          <div className="absolute right-4 md:right-6">
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
                <p className="mt-3 max-w-xl line-clamp-3 text-base leading-6 text-muted-foreground">
                  {product.longDescription}
                </p>
              </div>
            </div>

            <PayInFourWidget
              total={order.total}
              directCheckoutHref={`/checkout?product=${product.slug}&direct=pay-in-4`}
            />

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

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(18,23,21,0.12)] md:static md:border-t-0 md:pt-0 md:shadow-none">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 md:px-6">
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total</span>
              {product.merchantOffer ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {product.merchantOffer.value}% off
                </span>
              ) : null}
            </div>
            <span className="text-2xl font-bold">
              {formatCurrency(order.total)}
            </span>
          </div>
          <Button
            render={<Link href={`/checkout?product=${product.slug}`} />}
            size="lg"
            className="h-12 shrink-0 rounded-full px-5 shadow-[var(--checkout-button-shadow)]"
            nativeButton={false}
          >
            Continue to checkout
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </footer>
    </main>
  )
}
