import React, { useEffect, useState } from "react"
import { config, useTransition } from "react-spring"
import { t } from "../../utils/i18n"
import { Box } from "../Box"
import { Button } from "../Button"
import { OrbitControlHelp } from "../OrbitControlHelp"
import { RightPanel, RightPanelProps } from "../RightPanel"
import { Space } from "../Space"
import { StepContainer, StepContainerProps } from "../StepContainer"

type Props = Omit<RightPanelProps, "opened" | "onClose"> & StepContainerProps

export const StepFinal: React.FC<Props> = ({ animatedStyles, ...props }) => {
  // first animation is done by animatedStyles from app.tsx
  // once component is mounted we use helpTransitions style
  // we use this workaround to keep consistent animation delay with previous step
  const [mounted, setMounted] = useState(false)
  const [helpOpened, setHelpOpened] = useState(true)
  const [panelOpened, setPanelOpened] = useState(false)
  const helpTransitions = useTransition(helpOpened, {
    from: { opacity: 1, translateY: "100%" },
    enter: { opacity: 1, translateY: "0%" },
    leave: { opacity: 0, translateY: "100%" },
    trail: 200,
    delay: 200,
  })
  const buttonTransitions = useTransition(!helpOpened && !panelOpened, {
    from: { scale: 0.1, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    leave: { scale: 0.9, opacity: 0 },
    reverse: panelOpened,
    trail: 200,
    config: config.stiff,
  })

  useEffect(() => {
    const enterAnimationDuration = 700
    setTimeout(() => {
      // set component as mounted once animation from app.tsx transitions is done
      setMounted(true)
    }, enterAnimationDuration)
  }, [])

  return (
    <>
      {helpTransitions(
        (transitionStyle, visible) =>
          visible && (
            <StepContainer animatedStyles={mounted ? transitionStyle : animatedStyles}>
              <OrbitControlHelp onClose={() => setHelpOpened(false)} />
            </StepContainer>
          ),
      )}

      {buttonTransitions(
        (transitionStyle, visible) =>
          visible && (
            <StepContainer
              animatedStyles={transitionStyle}
              withoutBackground={true}
            >
              <Box direction="row" align="center" justify="center">
                <Button
                  iconName="settings-regular"
                  onPress={() => setPanelOpened(true)}
                >
                  {t("panel.open")}
                </Button>

                <Space width={12} />

                <Button variation="secondary" onPress={() => setHelpOpened(true)}>
                  ?
                </Button>
              </Box>
            </StepContainer>
          ),
      )}

      <RightPanel
        {...props}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      />
    </>
  )
}
