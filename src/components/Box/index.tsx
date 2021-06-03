import clsx from "clsx"
import React from "react"
import styles from "./styles.module.css"

type Direction = "row" | "column"
type AlignItems = "start" | "center" | "end" | "stretch"
type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"

const directions: Record<Direction, string> = {
  column: styles.directionColumn,
  row: styles.directionRow,
}
const alignItems: Record<AlignItems, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
}
const justifyContent: Record<JustifyContent, string> = {
  "start": styles.justifyStart,
  "center": styles.justifyCenter,
  "end": styles.justifyEnd,
  "space-around": styles.justifyAround,
  "space-between": styles.justifyBetween,
}

type Props = {
  direction?: Direction
  align?: AlignItems
  justify?: JustifyContent
  wrap?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export const Box = React.forwardRef<HTMLDivElement | null, Props>(
  (
    {
      direction = "column",
      align = "stretch",
      justify = "start",
      wrap = false,
      className,
      style,
      children,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          styles.base,
          wrap && styles.wrap,
          className,
          directions[direction],
          alignItems[align],
          justifyContent[justify],
        )}
        style={style}
      >
        {children}
      </div>
    )
  },
)

Box.displayName = "Box"
