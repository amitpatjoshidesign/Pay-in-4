import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { createInstallments, formatCurrency } from "@/data/checkout"

type InstallmentScheduleProps = {
  total: number
}

export function InstallmentSchedule({ total }: InstallmentScheduleProps) {
  const installments = createInstallments(total)

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius)] border bg-muted p-3">
      <Progress value={75}>
        <ProgressLabel>Pay4 schedule</ProgressLabel>
        <ProgressValue>{() => "4 payments"}</ProgressValue>
      </Progress>

      <div className="grid gap-3">
        {installments.map((installment) => {
          const Icon = installment.icon

          return (
            <div
              key={installment.label}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-[calc(var(--radius)*0.72)] border bg-background text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {installment.label} · {installment.date}
                </p>
                <p className="text-xs text-muted-foreground">
                  {installment.status}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">
                {formatCurrency(installment.amount)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex items-start gap-2 rounded-[var(--radius)] bg-background p-3 shadow-[var(--checkout-soft-shadow)]">
        <ShieldCheck className="mt-0.5 size-4 text-primary" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">No interest, no hidden fees</p>
            <Badge
              variant="outline"
              className="border-0 bg-accent text-accent-foreground"
            >
              Soft approval
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The shopper sees the schedule before placing the order.
          </p>
        </div>
      </div>
    </div>
  )
}
