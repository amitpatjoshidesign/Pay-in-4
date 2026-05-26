import {
  formatCurrency,
  getDiscountedProductPrice,
  getMerchantOfferDiscount,
  type Product,
} from "@/data/checkout"

type MerchantOfferStripProps = {
  product: Product
}

export function MerchantOfferStrip({ product }: MerchantOfferStripProps) {
  if (!product.merchantOffer) {
    return null
  }

  const discountAmount = getMerchantOfferDiscount(product)
  const discountedPrice = getDiscountedProductPrice(product)

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-emerald-200 bg-emerald-50 px-3 py-3 text-emerald-950">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm font-semibold">
          Merchant offer: {product.merchantOffer.label}
        </p>
        <p className="shrink-0 text-xs font-semibold text-emerald-700">
          Save {formatCurrency(discountAmount)}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-emerald-900/65 line-through">
          {formatCurrency(product.price)}
        </span>
        <span className="text-base font-bold tabular-nums">
          {formatCurrency(discountedPrice)}
        </span>
      </div>
    </div>
  )
}
