import { type ReactNode } from "react"
import Image from "next/image"
import { type LucideIcon } from "lucide-react"

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
  description?: string
  detail: string
  meta?: ReactNode
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
  meta,
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
      <Field orientation="horizontal" className="items-start gap-3 px-0 py-0">
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
            {badge ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold leading-4 text-muted-foreground">
                {badge}
              </span>
            ) : null}
            {offer ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold leading-4 text-primary">
                {offer}
              </span>
            ) : null}
          </div>
          {description ? (
            <FieldDescription className="text-xs leading-5">
              {description}
            </FieldDescription>
          ) : null}
          <p className="text-xs font-medium leading-5 text-muted-foreground">
            {detail}
          </p>
          {meta ? <div className="pt-1">{meta}</div> : null}
        </FieldContent>
        <RadioGroupItem id={id} value={value} className="mt-1" />
      </Field>
    </FieldLabel>
  )
}
