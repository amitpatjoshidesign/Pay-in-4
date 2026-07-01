import Image from "next/image"
import Link from "next/link"

export function ProductBrand() {
  return (
    <Link
      href="/"
      aria-label="Go to home"
      className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005857]/30"
    >
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
    </Link>
  )
}
