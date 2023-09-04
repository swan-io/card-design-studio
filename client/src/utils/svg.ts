import { encodeBase64 } from "@swan-io/lake/src/utils/base64";
import { isNotNullish, isNotNullishOrEmpty } from "@swan-io/lake/src/utils/nullish";
import deburr from "lodash/deburr";
import { match } from "ts-pattern";

const BASE64_URI_PREFIX = "data:image/svg+xml;base64,";

export const convertPngFileToBase64Uri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      if (typeof event.target?.result !== "string") {
        return reject("No content");
      }
      resolve(event.target.result);
    };

    reader.readAsDataURL(file);
  });

export const convertSvgFileToString = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      if (typeof event.target?.result !== "string") {
        return reject("No content");
      }
      resolve(event.target.result);
    };

    reader.readAsText(file);
  });

export const convertStringToSvg = (content: string, fileName = ""): SVGElement => {
  // deburr file content to avoid base64 encoding errors (for example with french accent)
  const cleanedContent = deburr(content);
  const parser = new DOMParser();
  const document = parser.parseFromString(cleanedContent, "image/svg+xml");

  if (!(document.children[0] instanceof SVGElement)) {
    throw new Error(`File "${fileName}" isn't a valid svg`);
  }

  return document.children[0];
};

export const convertSvgToBase64Uri = (svg: SVGElement): string => {
  return BASE64_URI_PREFIX + encodeBase64(svg.outerHTML);
};

export const getSvgSize = (svg: SVGElement): Size => {
  // first we try to get width and height from "width" and "height" attributes
  const widthAttr = svg.getAttribute("width");
  const heightAttr = svg.getAttribute("height");

  const width = widthAttr != null ? parseInt(widthAttr) : NaN;
  const height = heightAttr != null ? parseInt(heightAttr) : NaN;

  if (!isNaN(width) || !isNaN(height)) {
    return { width, height };
  }

  // if height and width aren't provided, we get values from viewBox attribute
  const viewBox = svg.getAttribute("viewBox");
  const [, , boxWidthAttr, boxHeightAttr] = viewBox?.split(" ") ?? [];

  const boxWidth = boxWidthAttr != null ? parseInt(boxWidthAttr) : NaN;
  const boxHeight = boxHeightAttr != null ? parseInt(boxHeightAttr) : NaN;

  if (isNaN(boxWidth) || isNaN(boxHeight)) {
    throw new Error("Invalid SVG Imported: an SVG must have a viewBox attribute");
  }

  return {
    width: boxWidth,
    height: boxHeight,
  };
};

// Create image with 1024px width or 256px height to optimize threejs mipmapping
const getImageSize = (size: Size): Size => {
  const ratio = size.width / size.height;
  // if svg is wider, we set width at 1024px and adapt height
  if (ratio >= 1) {
    const width = 1024;
    const height = width / ratio;
    return { width, height };
  } else {
    // we set height at 256px and adapt width
    const height = 256;
    const width = height * ratio;
    return { width, height };
  }
};

const isSvgColored = (element: Element): boolean => {
  const fill = element.getAttribute("fill");
  const stroke = element.getAttribute("stroke");
  const style = element.getAttribute("style");

  if (element.tagName === "style") {
    return element.innerHTML.includes("fill") || element.innerHTML.includes("stroke");
  }

  if (isNotNullishOrEmpty(fill) || isNotNullishOrEmpty(stroke) || isNotNullishOrEmpty(style)) {
    return true;
  }

  return [...element.children].some(children => isSvgColored(children));
};

/**
 * This function create a matrix which can be used in <feColorMatrix> element
 * More info here: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix
 */
const getMatrixColor = (color: "white" | "black"): string => {
  const colorIntensity = color === "white" ? 1 : 0;
  const red = colorIntensity;
  const green = colorIntensity;
  const blue = colorIntensity;
  const alpha = 1;

  // prettier-ignore
  const matrix = [
    red,   red,   red,   red,   red,   // R
    green, green, green, green, green, // G
    blue,  blue,  blue,  blue,  blue,  // B
    0,     0,     0,     alpha, 0,     // A
  ]

  return matrix.join(" ");
};

// this function make the svg white to be used as material alpha map
// this function make the svg black to be used in SvgDropzone
export const getMonochromeSvg = (svg: SVGElement, color: "white" | "black"): SVGElement => {
  const hexaCode = match(color)
    .with("black", () => "#000")
    .with("white", () => "#FFF")
    .exhaustive();

  const newSvg = svg.cloneNode(true) as SVGElement;

  if (!isSvgColored(svg)) {
    newSvg.setAttribute("fill", hexaCode);
    newSvg.setAttribute("stroke", hexaCode);
    return newSvg;
  }

  const tagsToNotChange = ["mask"];

  const changeElementColor = (element: Element): void => {
    if (element.tagName === "style") {
      const css = element.innerHTML;
      const regex =
        /#[A-F0-9]{6,6}|#[A-F0-9]{3,3}|rgb\(\d{1,3},\d{1,3},\d{1,3}\)|rgba\(\d{1,3},\d{1,3},\d{1,3},\d\.?\d{0,}\)/gim;

      const cssWithColor = css.replace(regex, hexaCode);
      element.innerHTML = cssWithColor;
    }

    if (element.tagName === "feColorMatrix") {
      const matrix = getMatrixColor(color);
      element.setAttribute("type", "matrix");
      element.setAttribute("values", matrix);
    }

    const isElementToChange = !tagsToNotChange.includes(element.tagName);

    const fill = isElementToChange ? element.getAttribute("fill") : null;
    const stroke = isElementToChange ? element.getAttribute("stroke") : null;
    const stopColor = isElementToChange ? element.getAttribute("stop-color") : null;
    const style = isElementToChange ? element.getAttribute("style") : null;

    if (isNotNullishOrEmpty(fill) && fill !== "none") {
      element.setAttribute("fill", hexaCode);
    }
    if (isNotNullishOrEmpty(stroke) && stroke !== "none") {
      element.setAttribute("stroke", hexaCode);
    }
    // stop-color is used for gradients
    if (isNotNullishOrEmpty(stopColor) && stopColor !== "none") {
      element.setAttribute("stop-color", hexaCode);
    }
    if (isNotNullish(style)) {
      const styleWithColor = style
        .split(";")
        .map(rule => {
          const [property, value] = rule.split(":");
          // stop-color is used for gradients
          if (
            isNotNullish(property) &&
            ["fill", "stroke", "stop-color"].includes(property) &&
            value !== "none"
          ) {
            return `${property}:${hexaCode}`;
          }
          return rule;
        })
        .join(";");

      element.setAttribute("style", styleWithColor);
    }

    [...element.children].forEach(children => changeElementColor(children));
  };

  changeElementColor(newSvg);

  return newSvg;
};

// Size and path copied from https://github.com/swan-io/lake/blob/main/packages/lake/src/components/SwanLogo.tsx
export const createSwanLogoSvg = (): SVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const width = 45;
  const height = 10;

  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M41.01 0c2.2 0 3.66 1.6 3.66 3.82v5.95H42.9V3.9c0-1.28-1-2.19-2.23-2.19a2.33 2.33 0 00-2.37 2.4v5.65h-1.83V.27h1.83v.92A3.4 3.4 0 0141 0zM30.77 9.73H29.2c-2.65 0-4.53-2.27-4.53-4.86A4.81 4.81 0 0129.44 0c2.92 0 4.93 1.74 4.93 4.45v5.32h-1.71V4.45c0-1.72-1.2-2.76-3.22-2.76a3.11 3.11 0 00-3.06 3.18c0 1.72 1.2 3.17 2.82 3.17h1.57v1.7zm-14.37-7l-2.25 7.04h-2.1L9.07.27h1.96l2.11 7.16L15.45.27h1.9l2.3 7.16L21.76.27h1.96l-3 9.5h-2.1zM4.14 10C1.94 10 .54 8.82.36 6.93L.33 6.7h1.79l.02.18c.15.98.84 1.48 2.07 1.48s1.93-.54 1.93-1.38c0-.82-.5-1.1-2.15-1.42l-.43-.09C1.54 5.05.64 4.41.64 2.76.64 1.1 2.1 0 4.18 0 6.06 0 7.5 1.12 7.65 2.83l.02.23H5.9l-.02-.19c-.12-.79-.72-1.25-1.79-1.25-1.03 0-1.68.47-1.68 1.14 0 .68.47.92 1.99 1.2l.6.12c2 .4 2.93 1.1 2.93 2.83C7.93 8.76 6.4 10 4.14 10z",
  );
  path.setAttribute("fill", "#000");

  svg.appendChild(path);

  return svg;
};

export const createSvgImage = (svg: SVGElement): HTMLImageElement => {
  const svgSize = getSvgSize(svg);
  const base64Uri = convertSvgToBase64Uri(svg);
  const { width, height } = getImageSize(svgSize);
  const image = new Image(width, height);
  image.src = base64Uri;

  return image;
};
