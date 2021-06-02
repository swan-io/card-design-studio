import React, { useMemo } from "react"
import { match } from "ts-pattern"
import { useSize } from "../../hooks/useSize"
import styles from "./styles.module.css"

const BORDER_WIDTH = 2
const BORDER_OFFSET = BORDER_WIDTH / 2

type Point =
  | { type: "M"; x: number; y: number }
  | { type: "L"; x: number; y: number }
  | { type: "C"; x: number; y: number; r: number } // C doesn't exists in SVG specs, we create it only for quarter circle

const generatePath = (points: Point[]): string =>
  points
    .reduce(
      (acc, point) =>
        match(point)
          .with({ type: "M" }, ({ x, y }) => `${acc} M${x},${y}`)
          .with({ type: "L" }, ({ x, y }) => `${acc} L${x},${y}`)
          .with(
            { type: "C" },
            ({ x, y, r }) => `${acc} A${r},${r} 0 0 1 ${x},${y}`,
          )
          .exhaustive(),
      "",
    )
    .trim()

const computePathLength = (points: Point[]): number =>
  points.reduce((acc, point, index) => {
    if (index === 0) {
      return acc
    }
    const previousPoint: Point = points[index - 1]

    return match(point)
      .with({ type: "M" }, () => acc)
      .with({ type: "L" }, ({ x, y }) => {
        const dX = x - previousPoint.x
        const dY = y - previousPoint.y
        const distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
        return acc + distance
      })
      .with({ type: "C" }, ({ r }) => {
        // as we use arc circle only to create quarter circle only
        // we simplify the formula in this case
        const perimeter = 2 * Math.PI * r
        const distance = perimeter / 4
        return acc + distance
      })
      .exhaustive()
  }, 0)

type PathProps = {
  points: Point[]
  isDraw: boolean
}

const Path: React.FC<PathProps> = ({ points, isDraw }) => {
  const path = useMemo(() => generatePath(points), [points])
  const pathLength = useMemo(() => computePathLength(points), points)

  return (
    <path
      className={styles.border}
      strokeWidth={BORDER_WIDTH}
      strokeDasharray={pathLength}
      strokeDashoffset={isDraw ? 0 : pathLength}
      d={path}
    />
  )
}

type PathsGroupProps = {
  width: number
  height: number
  radius: number
  isDraw: boolean
}

export const PathsGroup: React.FC<PathsGroupProps> = ({
  width,
  height,
  radius,
  isDraw,
}) => {
  const points1: Point[] = useMemo(
    () => [
      { type: "M", x: BORDER_OFFSET + radius, y: BORDER_OFFSET },
      { type: "L", x: width - radius, y: BORDER_OFFSET },
      {
        type: "C",
        r: radius,
        x: width,
        y: BORDER_OFFSET + radius,
      },
      { type: "L", x: width, y: height - radius },
      {
        type: "C",
        r: radius,
        x: width - radius,
        y: height,
      },
    ],
    [width, height, radius],
  )
  const points2: Point[] = useMemo(
    () => [
      { type: "M", x: width - radius, y: height },
      { type: "L", x: BORDER_OFFSET + radius, y: height },
      {
        type: "C",
        r: radius,
        x: BORDER_OFFSET,
        y: height - radius,
      },
      { type: "L", x: BORDER_OFFSET, y: BORDER_OFFSET + radius },
      {
        type: "C",
        r: radius,
        x: BORDER_OFFSET + radius,
        y: BORDER_OFFSET,
      },
    ],
    [width, height, radius],
  )

  return (
    <>
      <Path points={points1} isDraw={isDraw} />
      <Path points={points2} isDraw={isDraw} />
    </>
  )
}

type Props = {
  targetRef: React.MutableRefObject<HTMLElement | null>
  focused: boolean
  offset: number
  radius: number
}

export const FocusedRing: React.FC<Props> = ({
  targetRef,
  focused,
  offset,
  radius,
}) => {
  const size = useSize(targetRef)
  if (!size) {
    return null
  }

  const { width, height } = size
  const rectWidth = width + offset * 2
  const rectHeight = height + offset * 2
  const shapeWidth = rectWidth - BORDER_OFFSET
  const shapeHeight = rectHeight - BORDER_OFFSET
  const style: React.CSSProperties = {
    top: -offset,
    left: -offset,
  }

  return (
    <svg
      className={styles.base}
      width={rectWidth}
      height={rectHeight}
      style={style}
    >
      <PathsGroup
        width={shapeWidth}
        height={shapeHeight}
        radius={radius}
        isDraw={focused}
      />
    </svg>
  )
}
