import Image from "next/image"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type PaymentMethodCardProps = {
  id: string
  value: string
  title: string
  description: string
  detail: string
  badge?: string
  offer?: string
  icon: LucideIcon
  iconSrc?: string
  selected: boolean
}

export function PaymentMethodCard({
  id,
  value,
  title,
  description,
  detail,
  badge,
  offer,
  icon: Icon,
  iconSrc,
  selected,
}: PaymentMethodCardProps) {
  return (
    <FieldLabel
      htmlFor={id}
      className={cn(
        "block w-full cursor-pointer rounded-none border-0 bg-transparent shadow-none transition-colors hover:text-foreground has-[>[data-slot=field]]:rounded-none has-[>[data-slot=field]]:border-0 has-data-checked:border-transparent has-data-checked:bg-transparent *:data-[slot=field]:p-0",
        selected && "text-primary"
      )}
    >
      <Field orientation="horizontal" className="items-start gap-3 px-0 py-4">
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center text-muted-foreground",
            selected && "text-primary"
          )}
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          ) : (
            <Icon className="size-4" aria-hidden="true" />
          )}
        </div>
        <FieldContent className="min-w-0 gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <FieldTitle
              className={cn(
                "text-sm font-semibold tracking-[0.01em]",
                selected && "text-primary"
              )}
            >
              {title}
            </FieldTitle>
            {offer ? (
              <Badge
                variant="secondary"
                className="border-0 bg-accent text-[var(--checkout-success)]"
              >
                {offer}
              </Badge>
            ) : badge ? (
              <Badge variant="secondary">{badge}</Badge>
            ) : null}
          </div>
          <FieldDescription className="text-xs leading-5">
            {description}
          </FieldDescription>
          <p className="text-xs font-medium leading-5 text-muted-foreground">
            {detail}
          </p>
        </FieldContent>
        <RadioGroupItem id={id} value={value} className="sr-only" />
        <ChevronRight
          className="mt-1 size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </Field>
    </FieldLabel>
  )
}
