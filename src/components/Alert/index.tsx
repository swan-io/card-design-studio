import React from "react"
import { Box } from "../Box"
import { Icon } from "../Icon"
import { Space } from "../Space"
import styles from './styles.module.css'

type Props = {
  children: string
}

export const Alert: React.FC<Props> = ({ children }) => {
  return (
    <Box direction="row" align="center" className={styles.base}>
      <Icon name="info-filled" width={20} />
      <Space width={8} />
      <span>{children}</span>
    </Box>
  )
}
