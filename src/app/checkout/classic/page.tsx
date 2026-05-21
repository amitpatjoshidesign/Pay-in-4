import { PayInFourDemo } from "@/components/checkout/pay-in-four-demo"
import { defaultProduct, getProductBySlug } from "@/data/checkout"

type ClassicCheckoutPageProps = {
  searchParams: Promise<{
    product?: string | string[]
  }>
}

export default async function ClassicCheckoutPage({
  searchParams,
}: ClassicCheckoutPageProps) {
  const params = await searchParams
  const slug = Array.isArray(params.product) ? params.product[0] : params.product
  const product = getProductBySlug(slug) ?? defaultProduct

  return <PayInFourDemo product={product} />
}
