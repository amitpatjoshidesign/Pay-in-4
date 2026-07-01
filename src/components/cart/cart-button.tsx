"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CartButton({
  className,
}: {
  className?: string
}) {
  const { itemCount } = useCart()

  return (
    <Button
      render={<Link href="/cart" aria-label="Cart" />}
      variant="outline"
      size="icon"
      nativeButton={false}
      className={cn("relative", className)}
    >
      <ShoppingCart aria-hidden="true" />
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-5 text-primary-foreground">
          {itemCount}
        </span>
      ) : null}
    </Button>
  )
}
