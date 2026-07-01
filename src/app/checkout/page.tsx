import { PayInFourDemo } from "@/components/checkout/pay-in-four-demo"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ entry?: string }>
}) {
  const params = await searchParams

  return <PayInFourDemo directPay4Entry={params.entry === "pay4"} />
}
