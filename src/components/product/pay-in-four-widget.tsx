"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { formatCurrency } from "@/data/checkout"
import { cn } from "@/lib/utils"

const installmentSteps = [
  { label: "Today", progress: 25 },
  { label: "In 14 days", progress: 50 },
  { label: "In 28 days", progress: 75 },
  { label: "In 42 days", progress: 100 },
]

type PayInFourWidgetProps = {
  total: number
  defaultExpanded?: boolean
  embedded?: boolean
}

function splitInstallments(total: number) {
  const baseAmount = Math.floor(total / 4)
  const remainder = total - baseAmount * 4

  return Array.from({ length: 4 }, (_, index) =>
    baseAmount + (index < remainder ? 1 : 0)
  )
}

export function PayInFourWidget({
  total,
  defaultExpanded = false,
  embedded = false,
}: PayInFourWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const installmentAmount = total / 4
  const installmentAmounts = splitInstallments(total)

  return (
    <div
      className={cn(
        embedded
          ? "border-t border-border/70 pt-3"
          : "rounded-[var(--radius)] border p-3"
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setExpanded((current) => !current)}
      >
        <div className="min-w-0">
          <p className="text-base font-semibold">Pay in 4</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(installmentAmount)} today, then every 2 weeks.
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {expanded ? (
        <div className="mt-3 divide-y divide-border/60">
          {installmentSteps.map((step, index) => (
            <div
              key={step.label}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="size-5 shrink-0 rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary) ${step.progress}%, var(--border) 0)`,
                  }}
                  aria-hidden="true"
                />
                <p className="truncate text-sm font-medium text-muted-foreground">
                  {step.label}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums">
                {formatCurrency(installmentAmounts[index])}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
