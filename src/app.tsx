import { useTransition } from "@react-spring/web"
import React, { useEffect, useState } from "react"
import {
  CubeTextureLoader,
  Font,
  FontLoader,
  LoadingManager,
  sRGBEncoding,
  TextureLoader,
} from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { match } from "ts-pattern"
import { CardCanvas } from "./components/CardPreview"
import { IntroView } from "./components/IntroView"
import { Step1Name } from "./components/Step1Name"
import { Step2Logo } from "./components/Step2Logo"
import { Step3Color } from "./components/Step3Color"
import { StepFinal } from "./components/StepFinal"
import { Card3dAssets } from "./types/assets"

type App3dAssets =
  | {
      status: "loading" | "failed"
      progress: number
    }
  | ({
      status: "complete"
      progress: number
    } & Card3dAssets)

const use3dAssets = (): App3dAssets => {
  const [assets, setAssets] = useState<App3dAssets>(() => ({
    status: "loading",
    progress: 0,
    gltf: null,
    environmentMap: null,
    cardTextures: null,
    font: null,
  }))

  useEffect(() => {
    const manager = new LoadingManager()
    const gltfLoader = new GLTFLoader(manager)
    const cubeTextureLoader = new CubeTextureLoader(manager)
    const textureLoader = new TextureLoader(manager)
    const fontLoader = new FontLoader(manager)

    const environmentMap = cubeTextureLoader.load([
      "environments/adams_palace_bridge/px.png",
      "environments/adams_palace_bridge/nx.png",
      "environments/adams_palace_bridge/py.png",
      "environments/adams_palace_bridge/ny.png",
      "environments/adams_palace_bridge/pz.png",
      "environments/adams_palace_bridge/nz.png",
    ])
    environmentMap.encoding = sRGBEncoding

    const cardTextures = {
      silver: textureLoader.load("/models/card/color_silver.jpg"),
      black: textureLoader.load("/models/card/color_black.jpg"),
    }
    // Use sRGBEncoding as GLTF Loader do
    cardTextures.black.encoding = sRGBEncoding
    cardTextures.silver.encoding = sRGBEncoding

    let font: Font
    fontLoader.load("/fonts/MarkPro_Regular.json", loadedFont => {
      font = loadedFont
    })
    let gltf: GLTF
    gltfLoader.load("/models/card/card.gltf", loadedGltf => {
      gltf = loadedGltf
    })

    manager.onProgress = (url, loaded, total) => {
      const progress = loaded / total
      setAssets({
        status: "loading",
        progress: progress,
      })
    }

    manager.onError = () => {
      setAssets({
        status: "failed",
        progress: 0,
      })
    }

    manager.onLoad = () => {
      setAssets({
        status: "complete",
        progress: 1,
        gltf,
        environmentMap,
        cardTextures,
        font,
      })
    }
  }, [])

  return assets
}

export const App: React.FC = () => {
  const assets = use3dAssets()
  const [step, setStep] = useState<ConfigurationStep>("intro")
  const [name, setName] = useState("")
  const [logo, setLogo] = useState<SVGElement | null>(null)
  const [logoScale, setLogoScale] = useState<number>(1)
  const [color, setColor] = useState<CardColor>("silver")

  const handleNameChange = (value: string) => {
    // limit name to 25 characters
    setName(value.substr(0, 25))
  }

  const transitions = useTransition(step, {
    from: { opacity: 1, translateY: "100%" },
    enter: { opacity: 1, translateY: "0%" },
    leave: { opacity: 0, translateY: "-100%" },
    trail: 200,
  })

  return (
    <>
      {transitions(({ opacity, translateY }, displayedStep) =>
        match(displayedStep)
          .with("intro", () => (
            <IntroView
              animatedStyles={{ opacity }}
              loadingProgress={assets.progress}
              onStart={() => setStep("name")}
            />
          ))
          .with("name", () => (
            <Step1Name
              animatedStyles={{ opacity, translateY }}
              name={name}
              onChange={handleNameChange}
              onNext={() => setStep("logo")}
            />
          ))
          .with("logo", () => (
            <Step2Logo
              animatedStyles={{ opacity, translateY }}
              logo={logo}
              logoScale={logoScale}
              onChangeLogo={setLogo}
              onChangeSize={setLogoScale}
              onNext={() => setStep("color")}
            />
          ))
          .with("color", () => (
            <Step3Color
              animatedStyles={{ opacity, translateY }}
              color={color}
              onChange={setColor}
              onNext={() => setStep("completed")}
            />
          ))
          .with("completed", () => (
            <StepFinal
              animatedStyles={{ opacity, translateY }}
              name={name}
              logo={logo}
              logoScale={logoScale}
              color={color}
              onChange={value => {
                match(value)
                  .with({ field: "name" }, ({ value }) => handleNameChange(value))
                  .with({ field: "logo" }, ({ value }) => setLogo(value))
                  .with({ field: "logoScale" }, ({ value }) =>
                    setLogoScale(value),
                  )
                  .with({ field: "color" }, ({ value }) => setColor(value))
                  .exhaustive()
              }}
            />
          ))
          .exhaustive(),
      )}

      {assets.status === "complete" && (
        <CardCanvas
          assets={assets}
          cameraPosition={step}
          name={name}
          color={color}
          logo={logo}
          logoScale={logoScale}
        />
      )}
    </>
  )
}
