import { useButton } from "@react-aria/button"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import clsx from "clsx"
import React, { useMemo, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useSize } from "../../hooks/useSize"
import { t } from "../../utils/i18n"
import {
  convertStringToSvg,
  convertSvgFileToString,
  convertSvgToBase64Uri,
  getMonochromeSvg,
  getSvgSize,
} from "../../utils/svg"
import { Box } from "../Box"
import { FocusedRing } from "../FocusedRing"
import { Icon } from "../Icon"
import { Label } from "../Label"
import { Space } from "../Space"
import { Text } from "../Text"
import styles from "./styles.module.css"

const CORNER_RADIUS = 6
const STROKE_WIDTH = 2
const LOGO_MAX_WIDTH = 300
const LOGO_MAX_HEIGHT = 40
const LOGO_MAX_RATIO = LOGO_MAX_WIDTH / LOGO_MAX_HEIGHT

const getLogoSize = ({ width, height }: Size): Size => {
  const ratio = width / height
  if (ratio > LOGO_MAX_RATIO) {
    const logoWidth = LOGO_MAX_WIDTH
    const logoHeight = logoWidth / ratio
    return { width: logoWidth, height: logoHeight }
  } else {
    const logoHeight = LOGO_MAX_HEIGHT
    const logoWidth = logoHeight * ratio
    return { width: logoWidth, height: logoHeight }
  }
}

const getSvgImgProps = (logo: SVGElement): Size & { src: string } => {
  const blackLogo = getMonochromeSvg(logo, "black")
  const svgSize = getSvgSize(blackLogo)
  const { width, height } = getLogoSize(svgSize)
  const src = convertSvgToBase64Uri(blackLogo)

  return {
    width,
    height,
    src,
  }
}

type DashedBorderProps = {
  width: number
  height: number
}

const DashedBorder: React.FC<DashedBorderProps> = ({ width, height }) => {
  return (
    <svg className={styles.borderSvg} width={width} height={height}>
      <rect
        className={styles.border}
        width={width - STROKE_WIDTH}
        height={height - STROKE_WIDTH}
        strokeWidth={STROKE_WIDTH}
        x={1}
        y={1}
        rx={CORNER_RADIUS}
        ry={CORNER_RADIUS}
      />
    </svg>
  )
}

type Props = {
  label: string
  help?: React.ReactNode
  logo: SVGElement | null
  onSvgDrop: (logo: SVGElement) => void
}

export const SvgDropzone: React.FC<Props> = React.memo(
  ({ label, help, logo, onSvgDrop }) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const size = useSize(ref)
    const [error, setError] = useState(false)

    const logoProps = useMemo(() => (logo ? getSvgImgProps(logo) : undefined), [
      logo,
    ])

    const { focusProps, isFocusVisible } = useFocusRing()

    const onDrop = ([file]: (File | undefined)[]) => {
      if (file) {
        convertSvgFileToString(file)
          .then(convertStringToSvg)
          .then(onSvgDrop)
          .then(() => {
            setError(false)
          })
          .catch(error => {
            console.error(error)
            setError(true)
          })
      } else {
        setError(true)
      }
    }

    const handlePress = () => {
      const input = ref.current?.querySelector("input")
      if (input) {
        input.click()
      }
    }
    const { buttonProps, isPressed } = useButton(
      { onPress: handlePress, elementType: "div" },
      ref,
    )
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragReject,
    } = useDropzone({
      multiple: false,
      accept: "image/svg+xml",
      onDrop,
    })
    const invalid = error || isDragReject

    return (
      <div>
        <Box direction="row" align="end" justify="space-between">
          <Label>{label}</Label>
          {help}
        </Box>
        <Space height={8} />
        <div
          {...mergeProps(buttonProps, focusProps, getRootProps())}
          ref={ref}
          className={clsx(
            styles.base,
            isPressed && styles.pressed,
            isDragActive && !isDragReject && styles.dragging,
            invalid && styles.invalid,
          )}
        >
          <input {...getInputProps()} />
          <Box
            direction="row"
            align="center"
            justify="center"
            className={styles.content}
          >
            {error || isDragReject ? (
              <>
                <Icon name="image-add-regular" width={20} />
                <Space width={12} />
                <Text variation="secondary">{t("dropzone.error")}</Text>
              </>
            ) : logoProps ? (
              <img {...logoProps} />
            ) : (
              <div>
                <Box direction="row" align="center" justify="center">
                  <Icon name="image-add-regular" width={20} />
                  <Space width={12} />
                  <Text variation="secondary">{t("dropzone.text")}</Text>
                </Box>
                <Space height={8} />
                <Text variation="secondary">{t("dropzone.fileFormat")}</Text>
              </div>
            )}
          </Box>

          {size && <DashedBorder width={size.width} height={size.height} />}

          <FocusedRing
            targetRef={ref}
            focused={isFocusVisible}
            offset={0}
            radius={6}
          />
        </div>
      </div>
    )
  },
)

SvgDropzone.displayName = "SvgDropzone"
