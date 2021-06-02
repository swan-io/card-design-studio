interface InterpolateParams {
  range: [number, number]
  output: [number, number]
}

export const clamp = (min: number, max: number) => (value: number): number =>
  Math.max(Math.min(value, max), min)

export const interpolate = ({
  range,
  output,
}: InterpolateParams): ((value: number) => number) => {
  return (value: number): number => {
    const inputRange = range[1] - range[0]
    const outputRange = output[1] - output[0]

    const valueWithoutOffset = value - range[0]
    const outputWithoutOffset = (outputRange * valueWithoutOffset) / inputRange
    const outputValue = outputWithoutOffset + output[0]

    return outputValue
  }
}
