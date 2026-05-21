import { PayInFourDemo } from "@/components/checkout/pay-in-four-demo"
import { defaultProduct, getProductBySlug } from "@/data/checkout"

type CheckoutPageProps = {
  searchParams: Promise<{
    product?: string | string[]
    direct?: string | string[]
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams
  const slug = Array.isArray(params.product) ? params.product[0] : params.product
  const direct = Array.isArray(params.direct) ? params.direct[0] : params.direct
  const product = getProductBySlug(slug) ?? defaultProduct

  return (
    <PayInFourDemo
      product={product}
      directPayInFour={direct === "pay-in-4"}
    />
  )
}
