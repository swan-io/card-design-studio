import { useFocusRing } from "@react-aria/focus"
import { useRadio, useRadioGroup } from "@react-aria/radio"
import { mergeProps } from "@react-aria/utils"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { RadioGroupState, useRadioGroupState } from "@react-stately/radio"
import clsx from "clsx"
import React, { useContext, useRef } from "react"
import { FocusedRing } from "../FocusedRing"
import { Label } from "../Label"
import { Space } from "../Space"
import styles from "./styles.module.css"

const RadioContext = React.createContext<RadioGroupState>({
  name: "",
  isDisabled: false,
  isReadOnly: false,
  lastFocusedValue: "",
  selectedValue: null,
  setLastFocusedValue: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setSelectedValue: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
})

type ColorRadioProps = {
  "aria-label": string
  "color": string
  "value": CardColor
}

export const ColorRadio: React.FC<ColorRadioProps> = props => {
  const { color, value } = props
  const state = useContext(RadioContext)
  const selected = state.selectedValue === value

  const inputRef = useRef<HTMLInputElement | null>(null)
  const circleRef = useRef<HTMLDivElement | null>(null)

  const { inputProps } = useRadio(props, state, inputRef)
  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <label className={styles.radioItem}>
      <VisuallyHidden>
        <input {...mergeProps(inputProps, focusProps)} ref={inputRef} />
      </VisuallyHidden>
      <div
        ref={circleRef}
        className={clsx(
          styles.radioCircle,
          selected && styles.radioCircleSelected,
        )}
        style={{ backgroundColor: color }}
      >
        <FocusedRing
          targetRef={circleRef}
          focused={isFocusVisible}
          offset={4}
          radius={27}
        />
      </div>

      <Space height={8} />

      <span
        className={clsx(
          styles.radioLabel,
          selected && styles.radioLabelSelected,
        )}
      >
        {props["aria-label"]}
      </span>
    </label>
  )
}

type ColorsRadioGroupProps = {
  label: string
  value: CardColor
  onChange: (value: string) => void
}

export const ColorsRadioGroup: React.FC<ColorsRadioGroupProps> = React.memo(
  props => {
    const { label, children } = props
    const state = useRadioGroupState(props)
    const { radioGroupProps, labelProps } = useRadioGroup(props, state)

    return (
      <div {...radioGroupProps}>
        <Label {...labelProps}>{label}</Label>
        <Space height={8} />
        <RadioContext.Provider value={state}>{children}</RadioContext.Provider>
      </div>
    )
  },
)

ColorsRadioGroup.displayName = "ColorsRadioGroup"
