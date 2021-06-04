import React, { useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

export const useSize = (
  ref: React.MutableRefObject<HTMLElement | null>,
): Size | null => {
  const [size, setSize] = useState<Size | null>(null)

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (ref.current) {
          const { clientWidth, clientHeight } = ref.current
          setSize({ width: clientWidth, height: clientHeight })
        }
      })

      resizeObserver.observe(ref.current)

      return () => {
        if (ref.current) {
          resizeObserver.unobserve(ref.current)
        }
        resizeObserver.disconnect()
      }
    }
  }, [])

  return size
}
