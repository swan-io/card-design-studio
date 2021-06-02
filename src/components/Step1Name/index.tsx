import React from "react"
import { t } from "../../utils/i18n"
import { Alert } from "../Alert"
import { Box } from "../Box"
import { Button } from "../Button"
import { Space } from "../Space"
import { StepContainer, StepContainerProps } from "../StepContainer"
import { TextField } from "../TextField"

type Props = {
  name: string
  onChange: (value: string) => void
  onNext: () => void
} & StepContainerProps

export const Step1Name: React.FC<Props> = ({
  animatedStyles,
  name,
  onChange,
  onNext,
}) => {
  return (
    <StepContainer animatedStyles={animatedStyles}>
      <TextField
        label={t("labels.name")}
        placeholder={t("placeholders.name")}
        value={name}
        onChange={onChange}
      />

      <Space height={16} />

      <Alert>{t("info.nameData")}</Alert>

      <Space height={24} />

      <Box direction="row" justify="end">
        <Button iconName="arrow-right-filled" onPress={onNext}>
          {t("step.next")}
        </Button>
      </Box>
    </StepContainer>
  )
}
