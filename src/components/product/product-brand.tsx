import Image from "next/image"

export function ProductBrand() {
  return (
    <div className="relative h-8 w-24">
      <Image
        src="/kone.svg"
        alt="Kone"
        fill
        priority
        className="object-contain"
        sizes="96px"
      />
    </div>
  )
}
