import React, { useMemo } from "react"
import { animated, useTransition } from "react-spring"
import { t } from "../../utils/i18n"
import { Box } from "../Box"
import { Button } from "../Button"
import { ColorRadio, ColorsRadioGroup } from "../ColorsRadioGroup"
import { Fill } from "../Fill"
import { Slider } from "../Slider"
import { Space } from "../Space"
import { SvgDropzone } from "../SvgDropzone"
import { Text } from "../Text"
import { TextField } from "../TextField"
import styles from "./styles.module.css"

export type RightPanelProps = {
  opened: boolean
  name: string
  logo: SVGElement | null
  color: CardColor
  logoScale: number
  setName: (value: string) => void
  setLogo: (logo: SVGElement) => void
  setLogoScale: (value: number) => void
  setColor: (color: CardColor) => void
  onClose: () => void
}

export const RightPanel: React.FC<RightPanelProps> = ({
  opened,
  name,
  logo,
  color,
  logoScale,
  setName,
  setLogo,
  setLogoScale,
  setColor,
  onClose,
}) => {
  const transitions = useTransition(opened, {
    from: { translateX: "100%" },
    enter: { translateX: "0%" },
    leave: { translateX: "100%" },
    reverse: opened,
  })

  const colorOptions = useMemo(
    () => (
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
    ),
    [],
  )

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
            onChange={setName}
          />

          <Space height={24} />

          <SvgDropzone
            label={t("labels.logo")}
            logo={logo}
            onSvgDrop={setLogo}
          />

          <Space height={24} />

          <Slider
            minValue={0}
            maxValue={1}
            step={0.01}
            label={t("labels.logoSize")}
            value={[logoScale]}
            onChange={([value]) => setLogoScale(value)}
          />

          <Space height={24} />

          <ColorsRadioGroup
            label={t("labels.color")}
            value={color}
            onChange={setColor as (value: string) => void}
          >
            {colorOptions}
          </ColorsRadioGroup>

          <Fill minHeight={24} />

          <Box direction="row" justify="center">
            <Button onPress={onClose}>{t("panel.close")}</Button>
          </Box>
        </animated.div>
      ),
  )
}
