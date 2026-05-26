"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency, splitInstallments } from "@/data/checkout"
import { cn } from "@/lib/utils"

const installmentSteps = [
  { label: "Today", progress: 25 },
  { label: "In 30 days", progress: 50 },
  { label: "In 60 days", progress: 75 },
  { label: "In 90 days", progress: 100 },
]

type PayInFourWidgetProps = {
  total: number
  originalTotal?: number
  defaultExpanded?: boolean
  embedded?: boolean
  offerPercent?: number
  directCheckoutHref?: string
}

export function PayInFourWidget({
  total,
  originalTotal,
  defaultExpanded = false,
  embedded = false,
  offerPercent,
  directCheckoutHref,
}: PayInFourWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const installmentAmounts = splitInstallments(total)
  const hasDiscountedTotal = Boolean(originalTotal && originalTotal > total)
  const dueNow = formatCurrency(installmentAmounts[0])
  const recurringAmount = formatCurrency(installmentAmounts[1])

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 rounded-[15px] bg-[var(--pay-in-four-panel)] p-1",
        !embedded && "shadow-none"
      )}
    >
      <div className="flex w-full items-center justify-between gap-3 p-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="shrink-0 text-sm font-bold italic leading-[18px] text-[var(--pay-in-four-panel-foreground)]">
            Pay in 4
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
                Pay {dueNow} now & then {recurringAmount}/m thrice
              </p>
            </>
          ) : (
            <div className="flex w-full items-center justify-between gap-3">
              <p className="min-w-0 text-sm font-medium leading-5 text-[rgba(28,28,28,0.8)]">
                Pay {dueNow} now & then {recurringAmount}/m thrice
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

        {expanded ? (
          <div className="mt-2 flex w-full flex-col">
            {installmentSteps.map((step, index) => (
              <div
                key={step.label}
                className={cn(
                  "flex w-full items-center justify-between gap-3 py-2",
                  index < installmentSteps.length - 1 &&
                    "border-b border-[rgba(28,28,28,0.05)] pb-[9px]"
                )}
              >
                <div className="flex min-w-0 items-center gap-[7px]">
                  <InstallmentProgress value={step.progress} />
                  <p className="truncate text-xs font-medium leading-5 text-[rgba(28,28,28,0.5)]">
                    {step.label}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold leading-5 text-[#1c1c1c] tabular-nums">
                  {formatCurrency(installmentAmounts[index])}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {directCheckoutHref ? (
          <div className="mt-3 flex justify-center border-t border-[color:var(--pay-in-four-surface-border)] pt-2">
            <Button
              render={<Link href={directCheckoutHref} />}
              nativeButton={false}
              size="sm"
              className="h-8 w-fit rounded-[10px] bg-transparent px-0 text-sm font-semibold text-[var(--pay-in-four-action)] shadow-none hover:bg-transparent hover:text-[var(--pay-in-four-action)]"
            >
              Buy now with Pay in 4
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function InstallmentProgress({ value }: { value: number }) {
  return (
    <span
      className="size-[18px] shrink-0 rounded-full"
      style={{
        background: `conic-gradient(var(--pay-in-four-progress) ${value}%, var(--pay-in-four-progress-track) 0)`,
      }}
      aria-hidden="true"
    />
  )
}
