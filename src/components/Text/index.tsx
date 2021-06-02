import React from "react"
import styles from "./styles.module.css"

type TextVariation = "title" | "main" | "secondary"

type Props = {
  children: string
  variation?: TextVariation
}

const variationStyles: Record<TextVariation, string> = {
  title: styles.title,
  main: styles.main,
  secondary: styles.secondary,
}

export const Text: React.FC<Props> = ({ children, variation = "main" }) => {
  return <span className={variationStyles[variation]}>{children}</span>
}
