import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { ProductBrand } from "@/components/product/product-brand"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { defaultProduct, formatCurrency, products } from "@/data/checkout"

export function ProductLanding() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <ProductBrand />
          <Button
            render={<Link href={`/checkout?product=${defaultProduct.slug}`} />}
            variant="outline"
            nativeButton={false}
          >
            <ShoppingCart data-icon="inline-start" />
            Checkout
          </Button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block rounded-[calc(var(--radius)*1.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`View ${item.name}`}
            >
              <Card className="h-full overflow-hidden rounded-[calc(var(--radius)*1.2)] border-border bg-background ring-0 shadow-[var(--checkout-soft-shadow)] transition-shadow group-hover:shadow-[var(--checkout-shadow)]">
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
                  <div className="flex min-w-0 items-start justify-between gap-3">
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
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
