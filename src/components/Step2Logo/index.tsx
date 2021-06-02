import React from "react"
import { t } from "../../utils/i18n"
import { createSwanLogoSvg } from "../../utils/logo"
import { Box } from "../Box"
import { Button } from "../Button"
import { Slider } from "../Slider"
import { Space } from "../Space"
import { StepContainer, StepContainerProps } from "../StepContainer"
import { SvgDropzone } from "../SvgDropzone"
import { Text } from "../Text"

const DEFAULT_LOGO_ZOOM = 0.6

type Props = {
  logo: SVGElement | null
  logoScale: number
  onChangeLogo: (value: SVGElement) => void
  onChangeSize: (value: number) => void
  onNext: () => void
} & StepContainerProps

export const Step2Logo: React.FC<Props> = ({
  animatedStyles,
  logo,
  logoScale,
  onChangeLogo,
  onChangeSize,
  onNext,
}) => {
  const setSwanLogo = () => {
    const swanLogo = createSwanLogoSvg()
    onChangeSize(DEFAULT_LOGO_ZOOM)
    onChangeLogo(swanLogo)
  }

  return (
    <StepContainer animatedStyles={animatedStyles}>
      <SvgDropzone
        label={t("labels.logo")}
        help={
          <Box direction="column" align="end">
            <Text variation="secondary">{t("logo.haventLogo")}</Text>
            <Space height={4} />
            <Button variation="empty" rightAligment={true} onPress={setSwanLogo}>
              {t("logo.useSwanLogo")}
            </Button>
          </Box>
        }
        logo={logo}
        onSvgDrop={onChangeLogo}
      />

      <Space height={16} />

      <Slider
        minValue={0}
        maxValue={1}
        step={0.01}
        label={t("labels.logoSize")}
        value={[logoScale]}
        onChange={([value]) => onChangeSize(value)}
      />

      <Space height={24} />

      <Box direction="row" justify="end">
        <Button
          iconName="arrow-right-filled"
          isDisabled={!logo}
          onPress={onNext}
        >
          {t("step.next")}
        </Button>
      </Box>
    </StepContainer>
  )
}
