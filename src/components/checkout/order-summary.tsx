import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  formatCurrency,
  type CheckoutOrder,
  type PaymentMethod,
  type Product,
} from "@/data/checkout"

type OrderSummaryProps = {
  order: CheckoutOrder
  paymentMethod: PaymentMethod
  product: Product
}

export function OrderSummary({
  order,
  product,
}: OrderSummaryProps) {
  return (
    <Card className="rounded-[var(--radius)] border-border ring-0 shadow-[var(--checkout-shadow)] lg:sticky lg:top-6">
      <CardHeader className="border-b">
        <CardTitle>Order summary</CardTitle>
        <CardDescription>{order.merchant}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border bg-background">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="72px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{order.itemName}</p>
            <p className="text-sm text-muted-foreground">
              {order.itemDescription}
            </p>
            <Badge
              variant="secondary"
              className="mt-2 border-0 bg-secondary text-muted-foreground"
            >
              Scheduled delivery
            </Badge>
          </div>
          <p className="font-medium tabular-nums">
            {formatCurrency(order.subtotal)}
          </p>
        </div>

        <Separator />

        <div className="grid gap-2 text-sm">
          <SummaryRow label="Subtotal" value={order.subtotal} />
          <SummaryRow label="Delivery" value={order.delivery} included />
          <SummaryRow label="GST" value={order.gst} included />
          <SummaryRow
            label="Purchase protection"
            value={order.protection}
            included
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="font-medium">Total</p>
          <p className="text-xl font-semibold tabular-nums">
            {formatCurrency(order.total)}
          </p>
        </div>

      </CardContent>
    </Card>
  )
}

function SummaryRow({
  label,
  value,
  included,
}: {
  label: string
  value: number
  included?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">
        {included ? "Included" : formatCurrency(value)}
      </span>
    </div>
  )
}
