import { useFocusRing } from "@react-aria/focus"
import { useTextField } from "@react-aria/textfield"
import { mergeProps } from "@react-aria/utils"
import React, { useRef } from "react"
import { Box } from "../Box"
import { FocusedRing } from "../FocusedRing"
import { Label } from "../Label"
import { Space } from "../Space"
import styles from "./styles.module.css"

type Props = {
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
}

export const TextField: React.FC<Props> = React.memo(props => {
  const ref = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { labelProps, inputProps } = useTextField(props, inputRef)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { label } = props

  return (
    <Box>
      <Label {...labelProps}>{label}</Label>
      <Space height={8} />
      <Box ref={ref}>
        <input
          {...mergeProps(inputProps, focusProps)}
          ref={inputRef}
          className={styles.input}
        />
        <FocusedRing
          targetRef={ref}
          focused={isFocusVisible}
          offset={2}
          radius={6}
        />
      </Box>
    </Box>
  )
})

TextField.displayName = "TextField"
