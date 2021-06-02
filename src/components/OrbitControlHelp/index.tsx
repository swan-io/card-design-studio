import React from "react"
import { t } from "../../utils/i18n"
import { Box } from "../Box"
import { Text } from "../Text"
import { Button } from "../Button"
import { Icon } from "../Icon"
import { Space } from "../Space"

type Props = {
  onClose: () => void
}

export const OrbitControlHelp: React.FC<Props> = ({ onClose }) => {
  return (
    <div>
      <Box direction="row" align="center">
        <Icon name="cube-rotate-regular" width={40} />
        <Space width={16} />
        <Text>{t("help.rotation")}</Text>
      </Box>

      <Space height={16} />

      <Box direction="row" align="center">
        <Icon name="zoom-in-regular" width={40} />
        <Space width={16} />
        <Text>{t("help.zoom")}</Text>
      </Box>

      <Space height={16} />

      <Box direction="row" justify="center">
        <Button onPress={onClose}>
          {t("help.gotIt")}
        </Button>
      </Box>
    </div>
  )
}
