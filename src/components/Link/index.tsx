import { useButton } from "@react-aria/button"
import { useFocusRing } from "@react-aria/focus"
import { useHover } from "@react-aria/interactions"
import { mergeProps } from "@react-aria/utils"
import clsx from "clsx"
import React, { useRef } from "react"
import styles from "./styles.module.css"

type Props = {
  to: string
  children: string
}

export const Link: React.FC<Props> = React.memo(({ to, children }: Props) => {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { buttonProps, isPressed } = useButton({ elementType: "a" }, ref)
  const { hoverProps, isHovered } = useHover({})

  return (
    <div>
      <a
        {...mergeProps(buttonProps, focusProps, hoverProps)}
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        href={to}
        className={clsx(
          styles.base,
          isPressed && styles.pressed,
          isFocusVisible && styles.focused,
          isHovered && styles.focused,
        )}
      >
        {children}
      </a>
    </div>
  )
})

Link.displayName = "Link"
