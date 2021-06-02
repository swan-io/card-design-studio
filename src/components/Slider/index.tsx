import { useFocusRing } from "@react-aria/focus"
import { useNumberFormatter } from "@react-aria/i18n"
import { useSlider, useSliderThumb } from "@react-aria/slider"
import { mergeProps } from "@react-aria/utils"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { SliderState, useSliderState } from "@react-stately/slider"
import clsx from "clsx"
import React, { useRef } from "react"
import { useSize } from "../../hooks/useSize"
import { interpolate } from "../../utils/math"
import { FocusedRing } from "../FocusedRing"
import { Label } from "../Label"
import styles from "./styles.module.css"

const THUMB_RADIUS = 10
const THUMB_WIDTH = THUMB_RADIUS * 2
const THUMB_MARGIN = 7

type ThumbProps = {
  position: number
  state: SliderState
  trackRef: React.MutableRefObject<HTMLDivElement | null>
}

const Thumb: React.FC<ThumbProps> = props => {
  const { position, state, trackRef } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { thumbProps, inputProps } = useSliderThumb(
    {
      index: 0,
      trackRef,
      inputRef,
    },
    state,
  )
  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <div
      {...thumbProps}
      className={styles.thumbBase}
      style={{ transform: `translateX(${position}px)` }}
    >
      <div
        ref={ref}
        className={clsx(styles.thumb, isFocusVisible && styles.thumbFocused)}
      >
        <FocusedRing
          targetRef={ref}
          focused={isFocusVisible}
          offset={5}
          radius={15}
        />
      </div>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  )
}

type Props = {
  label: string
  value: number[]
  minValue: number
  maxValue: number
  step: number
  onChange?: (value: number[]) => void
}

export const Slider: React.FC<Props> = props => {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const size = useSize(trackRef)
  const numberFormatter = useNumberFormatter({ style: "percent" })
  const state = useSliderState({ ...props, numberFormatter })
  const { groupProps, trackProps, labelProps } = useSlider(
    props,
    state,
    trackRef,
  )

  const width = size?.width ?? 0
  const thumbPosition = interpolate({
    range: [0, 1],
    output: [0, width - THUMB_WIDTH],
  })(state.getThumbPercent(0))
  const leftBarWidth = Math.max(thumbPosition - THUMB_MARGIN, 0)
  const rightBarLeft = thumbPosition + THUMB_WIDTH + THUMB_MARGIN
  const rightBarWidth = width - rightBarLeft

  return (
    <div {...groupProps} className={styles.group}>
      <Label {...labelProps}>{props.label}</Label>
      {/* The track element holds the visible track line and the thumb. */}
      <div {...trackProps} ref={trackRef} className={styles.track}>
        <div className={styles.bar}>
          <div
            className={styles.barLeft}
            style={{ transform: `scaleX(${leftBarWidth / 100})` }}
          />
          <div
            className={styles.barRight}
            style={{ transform: `scaleX(${rightBarWidth / 100})` }}
          />
        </div>
        {size && (
          <Thumb position={thumbPosition} state={state} trackRef={trackRef} />
        )}
      </div>
    </div>
  )
}
