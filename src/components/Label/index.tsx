import React from "react"
import styles from "./styles.module.css"

export const Label: React.FC<
  React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
> = props => <label className={styles.base} {...props} />
