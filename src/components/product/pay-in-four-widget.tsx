"use client"

import { type ReactNode, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency, splitInstallments } from "@/data/checkout"
import { cn } from "@/lib/utils"

type PayInFourWidgetProps = {
  total: number
  originalTotal?: number
  defaultExpanded?: boolean
  embedded?: boolean
  offerPercent?: number
  directCheckoutHref?: string
  onDirectCheckout?: () => void
  supportingContent?: ReactNode
}

export function PayInFourWidget({
  total,
  originalTotal,
  defaultExpanded = false,
  embedded = false,
  offerPercent,
  directCheckoutHref,
  onDirectCheckout,
  supportingContent,
}: PayInFourWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const hasDiscountedTotal = Boolean(originalTotal && originalTotal > total)
  const installmentAmountValue = splitInstallments(total)[0]
  const installmentAmount = formatCurrency(installmentAmountValue)

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 rounded-[15px] bg-[var(--pay-in-four-panel)] p-1",
        !embedded && "shadow-none"
      )}
    >
      <div className="flex w-full items-center justify-between gap-3 p-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="shrink-0 text-sm font-bold italic leading-[18px] tracking-[0.01em] text-[var(--pay-in-four-panel-foreground)]">
            Pay4
          </p>
          {offerPercent ? (
            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold leading-4 text-white">
              {offerPercent}% off
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <p className="text-xs font-normal leading-[18px] text-[var(--pay-in-four-panel-foreground)] opacity-50">
            powered by
          </p>
          <Image
            src="/checkout-gateway/pinelabs-logo.svg"
            alt="Pine Labs"
            width={46}
            height={12}
            className="h-[11.7px] w-[46px] shrink-0"
          />
        </div>
      </div>

      <div
        className={cn(
          "w-full rounded-xl bg-[var(--pay-in-four-surface)]",
          expanded ? "px-3 pb-3 pt-3" : "p-3"
        )}
      >
        <button
          type="button"
          aria-expanded={expanded}
          className="w-full text-left"
          onClick={() => setExpanded((current) => !current)}
        >
          {hasDiscountedTotal ? (
            <>
              <div className="flex w-full items-center justify-between gap-3">
                <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-sm leading-5">
                  <span className="font-medium text-[rgba(28,28,28,0.62)]">
                    Get it for
                  </span>
                  <span className="font-semibold text-[#1c1c1c]">
                    {formatCurrency(total)}
                  </span>
                  <span className="text-xs font-medium text-[rgba(28,28,28,0.45)] line-through">
                    {formatCurrency(originalTotal ?? total)}
                  </span>
                </p>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-[rgba(28,28,28,0.5)] transition-transform",
                    expanded && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-medium leading-5 text-[rgba(28,28,28,0.8)]">
                Pay in 4 monthly installments of {installmentAmount}
              </p>
            </>
          ) : (
            <div className="flex w-full items-center justify-between gap-3">
              <p className="min-w-0 text-sm font-medium leading-5 text-[rgba(28,28,28,0.8)]">
                Pay in 4 monthly installments of {installmentAmount}
              </p>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-[rgba(28,28,28,0.5)] transition-transform",
                  expanded && "rotate-180"
                )}
                aria-hidden="true"
              />
            </div>
          )}
        </button>

        {supportingContent ? (
          <div className="mt-3">{supportingContent}</div>
        ) : null}

        {expanded ? (
          <div className="mt-3 flex w-full flex-col gap-3 border-t border-[rgba(28,28,28,0.05)] pt-3 text-[13px] leading-5 text-[rgba(28,28,28,0.68)]">
            <p>
              Pay4 splits your purchase into four equal monthly payments of{" "}
              <span className="font-semibold text-[#1c1c1c]">
                {installmentAmount}
              </span>{" "}
              on your eligible credit card. Your eligibility is checked during
              checkout.
            </p>
          </div>
        ) : null}

        {directCheckoutHref || onDirectCheckout ? (
          <div className="mt-3 flex justify-center border-t border-[color:var(--pay-in-four-surface-border)] pt-2">
            {directCheckoutHref ? (
              <Button
                render={<Link href={directCheckoutHref} />}
                nativeButton={false}
                size="sm"
                className="h-8 w-fit rounded-[10px] bg-transparent px-0 text-sm font-semibold text-[var(--pay-in-four-action)] shadow-none hover:bg-transparent hover:text-[var(--pay-in-four-action)]"
              >
                Buy now with Pay4
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="h-8 w-fit rounded-[10px] bg-transparent px-0 text-sm font-semibold text-[var(--pay-in-four-action)] shadow-none hover:bg-transparent hover:text-[var(--pay-in-four-action)]"
                onClick={onDirectCheckout}
              >
                Buy now with Pay4
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
