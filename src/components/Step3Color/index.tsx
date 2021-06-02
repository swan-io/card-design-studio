import React from "react"
import { t } from "../../utils/i18n"
import { Box } from "../Box"
import { Button } from "../Button"
import { ColorRadio, ColorsRadioGroup } from "../ColorsRadioGroup"
import { Space } from "../Space"
import { StepContainer, StepContainerProps } from "../StepContainer"

type Props = {
  color: CardColor
  onChange: (value: CardColor) => void
  onNext: () => void
} & StepContainerProps

export const Step3Color: React.FC<Props> = ({
  animatedStyles,
  color,
  onChange,
  onNext,
}) => {
  return (
    <StepContainer animatedStyles={animatedStyles}>
      <Box direction="row" justify="center">
        <ColorsRadioGroup
          label={t("labels.selectColor")}
          value={color}
          onChange={value => onChange(value as CardColor)}
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
      </Box>

      <Space height={24} />

      <Box align="center">
        <Button iconName="arrow-right-filled" onPress={onNext}>
          {t("step.confirm")}
        </Button>
      </Box>
    </StepContainer>
  )
}
