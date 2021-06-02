import { useProgressBar } from "@react-aria/progress"
import React, { useMemo } from "react"
import { t } from "../../utils/i18n"
import { interpolate } from "../../utils/math"
import { Fill } from "../Fill"
import styles from "./styles.module.css"

type Props = {
  "aria-label": string
  "minValue": number
  "maxValue": number
  "value": number
  "width": number | string
}

export const ProgressBar: React.FC<Props> = props => {
  const { minValue, maxValue, value, width } = props
  const { progressBarProps } = useProgressBar(props)

  const progress = useMemo(
    () =>
      interpolate({
        range: [minValue, maxValue],
        output: [0, 1],
      })(value),
    [minValue, maxValue, value],
  )

  return (
    <div {...progressBarProps} style={{ width }}>
      <div className={styles.base}>
        <div className={styles.background} />
        <div
          className={styles.progress}
          style={{ transform: `scaleX(${progress})` }}
        />
        <div className={styles.text}>
          <span>{t("intro.loading")}</span>
          <Fill minWidth={16} />
          <span>{progressBarProps["aria-valuetext"]}</span>
        </div>
      </div>
    </div>
  )
}
