import React from "react"

export type SpaceValue = 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64

type Props = {
  width?: SpaceValue
  height?: SpaceValue
}

export const Space: React.FC<Props> = React.memo(
  ({ width = 0, height = 0 }) => (
    <div style={{ width, height, flexShrink: 0 }} />
  ),
)

Space.displayName = "Space"
