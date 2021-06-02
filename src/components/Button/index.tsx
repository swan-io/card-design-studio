import { useButton } from "@react-aria/button"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import clsx from "clsx"
import React, { useRef } from "react"
import { FocusedRing } from "../FocusedRing"
import { Icon, IconName } from "../Icon"
import { Space } from "../Space"
import styles from "./styles.module.css"

type ButtonVariation = "primary" | "secondary" | "empty"

type Props = {
  children: string
  isDisabled?: boolean
  variation?: ButtonVariation
  iconName?: IconName
  rightAligment?: boolean
  onPress: () => void
}

const variationStyles: Record<ButtonVariation, string> = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  empty: styles.buttonEmpty,
}

export const Button: React.FC<Props> = props => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { buttonProps, isPressed } = useButton(
    { ...props, elementType: "div" },
    ref,
  )
  const {
    children,
    isDisabled,
    iconName,
    variation = "primary",
    rightAligment,
  } = props

  return (
    <div
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={clsx(
        styles.base,
        isPressed && styles.pressed,
        isDisabled && styles.disabled,
        variationStyles[variation],
        rightAligment && styles.rightAlign,
      )}
    >
      {children}

      {!!iconName && (
        <>
          <Space width={16} />
          <Icon name={iconName} width={20} />
        </>
      )}

      <FocusedRing
        targetRef={ref}
        focused={isFocusVisible}
        offset={5}
        radius={9}
      />
    </div>
  )
}
