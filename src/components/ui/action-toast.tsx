"use client"

import Link from "next/link"
import { ShoppingCart, X } from "lucide-react"

import { useCart } from "@/components/cart/cart-context"
import { Button, buttonVariants } from "@/components/ui/button"

type ActionToastProps = {
  title: string
  actionHref: string
  actionLabel: string
  onDismiss: () => void
}

export function ActionToast({
  title,
  actionHref,
  actionLabel,
  onDismiss,
}: ActionToastProps) {
  const { itemCount } = useCart()

  return (
    <div className="fixed inset-x-4 bottom-24 z-[60] mx-auto flex w-auto max-w-md items-center gap-3 rounded-[calc(var(--radius)*1.25)] border border-black bg-black pl-4 pr-1 py-3 text-white shadow-[0_20px_50px_rgba(18,23,21,0.32)] md:bottom-6">
      <p className="min-w-0 flex-1 text-sm font-medium text-white">
        {title}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={actionHref}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            className:
              "relative size-10 shrink-0 rounded-full border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white",
          })}
          aria-label={actionLabel}
        >
          <ShoppingCart aria-hidden="true" />
          {itemCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-5 text-black">
              {itemCount}
            </span>
          ) : null}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 text-white hover:bg-white/10 hover:text-white"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
