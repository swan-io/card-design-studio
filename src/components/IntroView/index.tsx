import { SpringValue } from "@react-spring/core"
import { animated } from "@react-spring/web"
import React, { useEffect, useState } from "react"
import { t } from "../../utils/i18n"
import { Box } from "../Box"
import { Button } from "../Button"
import { Icon } from "../Icon"
import { ProgressBar } from "../ProgressBar"
import { Space } from "../Space"
import styles from "./styles.module.css"

type Props = {
  animatedStyles: {
    opacity: SpringValue<number>
  }
  loadingProgress: number
  onStart: () => void
}

export const IntroView: React.FC<Props> = ({
  animatedStyles,
  loadingProgress,
  onStart,
}) => {
  const [startRequested, setStartRequested] = useState(false)

  const handleStart = () => {
    if (loadingProgress >= 1) {
      onStart()
    } else {
      setStartRequested(true)
    }
  }

  useEffect(() => {
    // if we clicked on start before all assets are loaded
    if (loadingProgress >= 1 && startRequested) {
      // we wait a little for first webgl render at background
      // and have an animation similar as if we click on start button after all assets are loaded
      const timeout = setTimeout(() => {
        onStart()
      }, 500)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [loadingProgress])

  return (
    <animated.div className={styles.container} style={animatedStyles}>
      <Box className={styles.base}>
        <h1 className={styles.title}>
          <Icon name="swan-logo" width={115} height={26} />
          <Space width={16} height={12} />
          {t("intro.title")}
        </h1>
        <Space height={24} />
        <h2 className={styles.subtitle}>{t("intro.subtitle")}</h2>
        <Space height={48} />

        <Box direction="row">
          {startRequested ? (
            <ProgressBar
              aria-label="Loading progress"
              minValue={0}
              maxValue={1}
              value={loadingProgress}
              width={223} // width of start button
            />
          ) : (
            <Button iconName="arrow-right-filled" onPress={handleStart}>
              {t("intro.start")}
            </Button>
          )}
        </Box>
      </Box>
    </animated.div>
  )
}
