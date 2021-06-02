import { useEffect, useRef } from "react"
import { Mesh } from "three"

// Those hooks are similar to useLazyRef except they dispose objects on unmount to avoid memory leaks
// more details here: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

export const useMesh = <T extends Mesh>(fn: () => T): T => {
  const ref = useRef<T>()
  if (!ref.current) ref.current = fn()

  useEffect(() => {
    // dispose geometry and material on unmount
    return () => {
      if (!ref.current) {
        return
      }
      const { geometry, material } = ref.current

      geometry.dispose()

      if (Array.isArray(material)) {
        for (const m of material) {
          m.dispose()
        }
      } else {
        material.dispose()
      }
    }
  })

  return ref.current
}

export const useThreejsObject = <T extends { dispose: () => void }>(
  fn: () => T,
): T => {
  const ref = useRef<T>()

  if (!ref.current) ref.current = fn()

  useEffect(() => {
    // dispose object on unmount
    return () => {
      ref.current?.dispose()
    }
  })

  return ref.current
}
