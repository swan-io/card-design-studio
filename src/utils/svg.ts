import { encode } from "base-64"
import deburr from "lodash/deburr"
import { match } from "ts-pattern"

const BASE64_URI_PREFIX = "data:image/svg+xml;base64,"

export const convertSvgFileToString = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (file.type !== "image/svg+xml") {
      reject("Bad format")
    }

    const reader = new FileReader()

    reader.onload = event => {
      if (typeof event.target?.result !== "string") {
        return reject("No content")
      }
      resolve(event.target.result)
    }

    reader.readAsText(file)
  })

export const convertStringToSvg = (
  content: string,
  fileName = "",
): SVGElement => {
  // deburr file content to avoid base64 encoding errors (for example with french accent)
  const cleanedContent = deburr(content)
  const parser = new DOMParser()
  const document = parser.parseFromString(cleanedContent, "image/svg+xml")

  if (!(document.children[0] instanceof SVGElement)) {
    throw new Error(`File "${fileName}" isn't a valid svg`)
  }

  return document.children[0]
}

export const convertSvgToBase64Uri = (svg: SVGElement): string => {
  return BASE64_URI_PREFIX + encode(svg.outerHTML)
}

export const getSvgSize = (svg: SVGElement): Size => {
  // first we try to get width and height from "width" and "height" attributes
  const widthAttr = svg.getAttribute("width")
  const heightAttr = svg.getAttribute("height")

  const width = widthAttr ? parseInt(widthAttr) : NaN
  const height = heightAttr ? parseInt(heightAttr) : NaN

  if (!isNaN(width) || !isNaN(height)) {
    return { width, height }
  }

  // if height and width aren't provided, we get values from viewBox attribute
  const viewBox = svg.getAttribute("viewBox")
  const [, , boxWidthAttr, boxHeightAttr] = viewBox?.split(" ") ?? []

  const boxWidth = boxWidthAttr ? parseInt(boxWidthAttr) : NaN
  const boxHeight = boxHeightAttr ? parseInt(boxHeightAttr) : NaN

  if (isNaN(boxWidth) || isNaN(boxHeight)) {
    throw new Error(
      "Invalid SVG Imported: an SVG must have a viewBox attribute",
    )
  }

  return {
    width: boxWidth,
    height: boxHeight,
  }
}

// Create image with 1024px width or 256px height to optimize threejs mipmapping
const getImageSize = (size: Size): Size => {
  const ratio = size.width / size.height
  // if svg is wider, we set width at 1024px and adapt height
  if (ratio >= 1) {
    const width = 1024
    const height = width / ratio
    return { width, height }
  } else {
    // we set height at 256px and adapt width
    const height = 256
    const width = height * ratio
    return { width, height }
  }
}

const isSvgColored = (element: Element): boolean => {
  const fill = element.getAttribute("fill")
  const stroke = element.getAttribute("stroke")
  const style = element.getAttribute("style")

  if (element.tagName === "style") {
    return (
      element.innerHTML.includes("fill") || element.innerHTML.includes("stroke")
    )
  }

  if (fill || stroke || style) {
    return true
  }

  return [...element.children].some(children => isSvgColored(children))
}

/**
 * This function create a matrix which can be used in <feColorMatrix> element
 * More info here: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix
 */
const getMatrixColor = (color: LogoColor): string => {
  const colorIntensity = color === "white" ? 1 : 0
  const red = colorIntensity
  const green = colorIntensity
  const blue = colorIntensity
  const alpha = 1

  // prettier-ignore
  const matrix = [
    red,   red,   red,   red,   red,   // R
    green, green, green, green, green, // G
    blue,  blue,  blue,  blue,  blue,  // B
    0,     0,     0,     alpha, 0,     // A
  ]

  return matrix.join(" ")
}

// this function make the svg white to be used as material alpha map
// this function make the svg black to be used in SvgDropzone
export const getMonochromeSvg = (
  svg: SVGElement,
  color: LogoColor,
): SVGElement => {
  const hexaCode = match(color)
    .with("black", () => "#000")
    .with("white", () => "#FFF")
    .exhaustive()

  const newSvg = svg.cloneNode(true) as SVGElement

  if (!isSvgColored(svg)) {
    newSvg.setAttribute("fill", hexaCode)
    newSvg.setAttribute("stroke", hexaCode)
    return newSvg
  }

  const tagsToNotChange = ["mask"]

  const changeElementColor = (element: Element): void => {
    if (element.tagName === "style") {
      const css = element.innerHTML
      const regex = /#[A-F0-9]{6,6}|#[A-F0-9]{3,3}|rgb\(\d{1,3},\d{1,3},\d{1,3}\)|rgba\(\d{1,3},\d{1,3},\d{1,3},\d\.?\d{0,}\)/gim

      const cssWithColor = css.replace(regex, hexaCode)
      element.innerHTML = cssWithColor
    }

    if (element.tagName === "feColorMatrix") {
      const matrix = getMatrixColor(color)
      element.setAttribute("type", "matrix")
      element.setAttribute("values", matrix)
    }

    const isElementToChange = !tagsToNotChange.includes(element.tagName)

    const fill = isElementToChange ? element.getAttribute("fill") : null
    const stroke = isElementToChange ? element.getAttribute("stroke") : null
    const stopColor = isElementToChange
      ? element.getAttribute("stop-color")
      : null
    const style = isElementToChange ? element.getAttribute("style") : null

    if (fill && fill !== "none") {
      element.setAttribute("fill", hexaCode)
    }
    if (stroke && stroke !== "none") {
      element.setAttribute("stroke", hexaCode)
    }
    // stop-color is used for gradients
    if (stopColor && stopColor !== "none") {
      element.setAttribute("stop-color", hexaCode)
    }
    if (style) {
      const styleWithColor = style
        .split(";")
        .map(rule => {
          const [property, value] = rule.split(":")
          // stop-color is used for gradients
          if (
            ["fill", "stroke", "stop-color"].includes(property) &&
            value !== "none"
          ) {
            return `${property}:${hexaCode}`
          }
          return rule
        })
        .join(";")

      element.setAttribute("style", styleWithColor)
    }

    ;[...element.children].forEach(children => changeElementColor(children))
  }

  changeElementColor(newSvg)

  return newSvg
}

export const createSvgImage = (svg: SVGElement): HTMLImageElement => {
  const svgSize = getSvgSize(svg)
  const base64Uri = convertSvgToBase64Uri(svg)
  const { width, height } = getImageSize(svgSize)
  const image = new Image(width, height)
  image.src = base64Uri

  return image
}
