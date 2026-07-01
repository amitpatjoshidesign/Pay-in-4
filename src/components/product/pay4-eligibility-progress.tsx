import { PAY4_ELIGIBILITY_THRESHOLD, formatCurrency } from "@/data/checkout"
import { cn } from "@/lib/utils"

type Pay4EligibilityProgressProps = {
  currentAmount: number
  thresholdAmount?: number
  className?: string
}

export function Pay4EligibilityProgress({
  currentAmount,
  thresholdAmount = PAY4_ELIGIBILITY_THRESHOLD,
  className,
}: Pay4EligibilityProgressProps) {
  const progressValue = Math.min(currentAmount, thresholdAmount)
  const remainingAmount = Math.max(thresholdAmount - currentAmount, 0)
  const progressPercent = Math.min((progressValue / thresholdAmount) * 100, 100)

  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)*1.2)] border bg-background/95 p-4 shadow-[var(--checkout-soft-shadow)] backdrop-blur",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Spend {formatCurrency(remainingAmount)} more to unlock Pay4.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pay4 is eligible on cart values above {formatCurrency(thresholdAmount)}.
        </p>
      </div>
      <div className="mt-3">
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary shadow-[var(--checkout-button-shadow)] transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
