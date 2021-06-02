import React from "react"
import { animated, useTransition } from "react-spring"
import { t } from "../../utils/i18n"
import { Box } from "../Box"
import { Button } from "../Button"
import { Text } from "../Text"
import { ColorRadio, ColorsRadioGroup } from "../ColorsRadioGroup"
import { Fill } from "../Fill"
import { Slider } from "../Slider"
import { Space } from "../Space"
import { SvgDropzone } from "../SvgDropzone"
import { TextField } from "../TextField"
import styles from "./styles.module.css"

export type ConfigFormValue =
  | { field: "name"; value: string }
  | { field: "color"; value: CardColor }
  | { field: "logo"; value: SVGElement }
  | { field: "logoScale"; value: number }

export type RightPanelProps = {
  opened: boolean
  name: string
  logo: SVGElement | null
  color: CardColor
  logoScale: number
  onChange: (value: ConfigFormValue) => void
  onClose: () => void
}

export const RightPanel: React.FC<RightPanelProps> = ({
  opened,
  name,
  logo,
  color,
  logoScale,
  onChange,
  onClose,
}) => {
  const transitions = useTransition(opened, {
    from: { translateX: '100%' },
    enter: { translateX: '0%' },
    leave: { translateX: '100%' },
    reverse: opened,
  })

  return transitions(
    (transitionStyles, visible) =>
      visible && (
        <animated.div className={styles.base} style={transitionStyles}>
          <Text variation="title">{t("panel.title")}</Text>

          <Space height={32} />

          <TextField
            label={t("labels.name")}
            placeholder={t("placeholders.name")}
            value={name}
            onChange={value => onChange({ field: "name", value })}
          />

          <Space height={24} />

          <SvgDropzone
            label={t("labels.logo")}
            logo={logo}
            onSvgDrop={logo => onChange({ field: "logo", value: logo })}
          />

          <Space height={24} />

          <Slider
            minValue={0}
            maxValue={1}
            step={0.01}
            label={t("labels.logoSize")}
            value={[logoScale]}
            onChange={([value]) => onChange({ field: "logoScale", value })}
          />

          <Space height={24} />

          <ColorsRadioGroup
            label={t("labels.color")}
            value={color}
            onChange={value =>
              onChange({ field: "color", value: value as CardColor })
            }
          >
            <Box direction="row">
              <ColorRadio
                aria-label={t("labels.silver")}
                color="#c9c9c9"
                value="silver"
              />
              <Space width={48} />
              <ColorRadio
                aria-label={t("labels.black")}
                color="#444444"
                value="black"
              />
            </Box>
          </ColorsRadioGroup>

          <Fill minHeight={24} />

          <Box direction="row" justify="center">
            <Button onPress={onClose}>{t("panel.close")}</Button>
          </Box>
        </animated.div>
      ),
  )
}
