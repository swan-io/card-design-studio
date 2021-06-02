import React, { memo } from "react"
import type { SpaceValue } from "../Space"

type Props = {
  minWidth?: SpaceValue
  minHeight?: SpaceValue
}

export const Fill: React.FC<Props> = memo(({ minWidth = 0, minHeight = 0 }) => (
  <div style={{ flex: 1, minWidth, minHeight, flexShrink: 0 }} />
))
