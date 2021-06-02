const LOGO_MAX_WIDTH = 5 // in cm
const LOGO_MAX_HEIGHT = 1 // in cm

export const computeCardLogoSize = (logoSize: {
  width: number
  height: number
}): { width: number; height: number } => {
  const logoRatio = logoSize.width / logoSize.height
  const cardSpaceRatio = LOGO_MAX_WIDTH / LOGO_MAX_HEIGHT

  // if logo is wider than available space
  // logo will have the same width than available space
  if (logoRatio >= cardSpaceRatio) {
    const width = LOGO_MAX_WIDTH
    const height = width / logoRatio
    return { width, height }
  } else {
    // if logo is higher than available space
    // logo will have the same height than available space
    const height = LOGO_MAX_HEIGHT
    const width = height * logoRatio
    return { width, height }
  }
}

export const createSwanLogoSvg = (): SVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  const symbol = document.getElementById("swan-logo")
  if (!symbol) {
    throw new Error("Swan logo symbol is missing in index.html")
  }
  const viewBox = symbol.getAttribute("viewBox")
  if (!viewBox) {
    throw new Error("viewBox is missing in Swan logo symbol in index.html")
  }

  const [, , width, height] = viewBox.split(" ")
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  svg.setAttribute("width", width)
  svg.setAttribute("height", height)
  svg.setAttribute("viewBox", viewBox)
  const path = symbol.children[0].cloneNode(true)
  svg.appendChild(path)
  return svg
}
