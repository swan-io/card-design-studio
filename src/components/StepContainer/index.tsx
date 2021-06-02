import { SpringValue } from "@react-spring/core"
import { animated } from "@react-spring/web"
import clsx from "clsx"
import React from "react"
import styles from "./styles.module.css"

export type StepContainerProps = {
  animatedStyles: {
    translateY?: SpringValue<string>
    scale?: SpringValue<number>
    opacity?: SpringValue<number>
  }
  withoutBackground?: boolean
}

export const StepContainer: React.FC<StepContainerProps> = ({
  animatedStyles,
  withoutBackground,
  children,
}) => {
  return (
    <animated.div className={styles.base} style={animatedStyles}>
      <div
        className={clsx(
          styles.container,
          !withoutBackground && styles.containerWithBackground,
        )}
      >
        {children}
      </div>
    </animated.div>
  )
}
