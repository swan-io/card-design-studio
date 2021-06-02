import React, { memo } from "react"

export type IconName =
  | "swan-logo"
  | "image-add-regular"
  | "arrow-right-filled"
  | "info-filled"
  | "cube-rotate-regular"
  | "zoom-in-regular"
  | "settings-regular"

interface Props {
  name: IconName
  width: number
  height?: number
}

export const Icon: React.FC<Props> = memo(({ name, width, height = width }) => {
  return (
    <svg style={{ width, height, flexShrink: 0 }}>
      <use xlinkHref={`#${name}`} />
    </svg>
  )
})
