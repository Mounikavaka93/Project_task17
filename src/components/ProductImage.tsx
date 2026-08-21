import { useState } from 'react'

const FALLBACK =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'

type ProductImageProps = {
  src: string
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <img
      src={failed ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`bg-paper object-cover ${className}`}
    />
  )
}
