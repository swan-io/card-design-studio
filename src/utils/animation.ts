import { EasingFunction } from "./easings"
import { interpolate } from "./math"

interface AnimationParams<T> {
  to: Partial<Record<keyof T, number>>
  duration: number
  easing?: EasingFunction
  onComplete?: () => void
}

export interface Animation<T> {
  start: (params: AnimationParams<T>) => void
  stop: () => void
  running: () => boolean
}

export const animate = <T>(target: T): Animation<T> => {
  let frame: number | undefined

  const stop = () => {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = undefined
    }
  }

  const start = ({ to, duration, easing, onComplete }: AnimationParams<T>) => {
    // in case there is already an animation running, we stop it before running the new animation
    stop()

    // check if all properties are numbers to run the animation
    for (const property in to) {
      if (typeof target[property] !== "number") {
        throw new Error(
          `Animation invalid type: only numbers can be animated and here property "${property}" type is ${typeof property}`,
        )
      }
    }

    // interpolate duration to percentage between 0 and 1 for easing
    const durationToPercentage = interpolate({
      range: [0, duration],
      output: [0, 1],
    })
    // interpolate percentage to value
    const interpolateValue: Partial<
      Record<keyof T, (value: number) => number>
    > = {}
    for (const property in to) {
      interpolateValue[property] = interpolate({
        range: [0, 1],
        // @ts-expect-error
        output: [target[property], to[property]], // we check at the begin of the function all properties contains number
      })
    }

    const startTime = Date.now()

    const tick = () => {
      const elapsedTime = Date.now() - startTime
      const time = Math.min(elapsedTime, duration)

      const percentage = durationToPercentage(time)
      const percentageValue = easing ? easing(percentage) : percentage

      for (const property in to) {
        // we are sure interpolateValue[property] is defined because we use the same loop
        // to generate `interpolateValue` record
        const value: number = interpolateValue[property]!(percentageValue)

        // we check at the begin of the function all properties contains number
        // @ts-expect-error
        target[property] = value
      }

      // we continue the animation only if we haven't reach the complete duration
      if (time < duration) {
        frame = requestAnimationFrame(tick)
      } else {
        onComplete?.()
        frame = undefined
      }
    }

    frame = requestAnimationFrame(tick)
  }

  const running = () => !!frame

  return { start, stop, running }
}
