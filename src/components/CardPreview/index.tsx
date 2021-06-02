import React, { memo, useEffect, useRef } from "react"
import {
  AmbientLight,
  Box3,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  Font,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PlaneGeometry,
  PointLight,
  RawShaderMaterial,
  ReinhardToneMapping,
  Scene,
  sRGBEncoding,
  TextGeometry,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils"
import { useLazyRef } from "../../hooks/useLazyRef"
import { useMesh, useThreejsObject } from "../../hooks/useThreejs"
import type { Card3dAssets } from "../../types/assets"
import { animate } from "../../utils/animation"
import * as easings from "../../utils/easings"
import { computeCardLogoSize } from "../../utils/logo"
import { interpolate } from "../../utils/math"
import { createSvgImage, getMonochromeSvg } from "../../utils/svg"
import gradientFragmentShader from "./gradientFragment.glsl?raw"
import gradientVertexShader from "./gradientVertex.glsl?raw"
import mapFragmentShader from "./mapFragment.glsl?raw"
import mapParsFragmentShader from "./mapParsFragment.glsl?raw"
import styles from "./styles.module.css"

type TextConfig = {
  content: string
  size: number
  side: "front" | "back"
  top: number
  left: number
}

const BACK_TEXT_ROTATION = Math.PI / 2
const FRONT_TEXT_ROTATION = -BACK_TEXT_ROTATION
const BACK_TEXT_POSITION = 0.039
const FRONT_TEXT_POSITION = -BACK_TEXT_POSITION
const LOGO_MARGIN_TOP = 0.3
const LOGO_MARGIN_RIGHT = 0.3

const ENV_MAP_INTENSITY = 3

const interpolateCos = interpolate({
  range: [-1, 1],
  output: [0, 1],
})

const nameTextConfig: TextConfig = {
  content: "",
  size: 0.2,
  side: "front",
  top: -1.8,
  left: -3.5,
}

const primaryTexts: TextConfig[] = [
  {
    content: "TM",
    size: 0.03,
    side: "front",
    left: 3.85,
    top: -2.15,
  },
  {
    content: "5105 1051 0510 5100",
    size: 0.3,
    side: "back",
    left: 3.8,
    top: -1.7,
  },
  {
    content: "08/23",
    size: 0.18,
    side: "back",
    left: 3.8,
    top: -2.2,
  },
  {
    content: "CVC 000",
    size: 0.18,
    side: "back",
    left: 2.55,
    top: -2.2,
  },
  {
    content: "debit",
    size: 0.25,
    side: "back",
    left: -1.9,
    top: -1.05,
  },
  {
    content: "Identifier 0000000000",
    size: 0.2,
    side: "back",
    left: 3.8,
    top: 0.3,
  },
]
const secondaryTexts: TextConfig[] = [
  {
    content: "This card is issued by Swan, pursuant to license",
    size: 0.145,
    side: "back",
    left: 3.8,
    top: -0.1,
  },
  {
    content: "by Mastercard international.",
    size: 0.145,
    side: "back",
    left: 3.8,
    top: -0.4,
  },
  {
    content: "support@swan.io",
    size: 0.11,
    side: "back",
    left: 3.8,
    top: 2.42,
  },
  {
    content: "IDEMIA 9 1212121L 09/21",
    size: 0.11,
    side: "back",
    left: -2,
    top: 2.42,
  },
]

// Use rgb values to animate Color object
const logoColors: Record<CardColor, { r: number; g: number; b: number }> = {
  black: {
    r: 0.93,
    g: 0.93,
    b: 0.93,
  },
  silver: { r: 0, g: 0, b: 0 },
}

// Camera positions
const cameraPositions: Record<
  CameraPosition,
  { getPosition: (ratio: number) => Vector3; rotation: Vector3 }
> = {
  intro: {
    getPosition: ratio => {
      const x = Math.min(-20, -12 / ratio)
      return new Vector3(x, 0, 0)
    },
    rotation: new Vector3(0, 0, 0),
  },
  name: {
    getPosition: ratio => {
      const x = Math.min(-4.7, -4.7 / ratio)
      return new Vector3(x, -2.3, -2.5)
    },
    rotation: new Vector3(0, 0, 0),
  },
  logo: {
    getPosition: ratio => {
      const x = Math.min(-10, -10 / ratio)
      // TODO improve z position
      return new Vector3(x, -1, 0)
    },
    rotation: new Vector3(0, 0, 0),
  },
  color: {
    getPosition: ratio => {
      const x = Math.min(-15, -9 / ratio)
      return new Vector3(x, 0, 0)
    },
    rotation: new Vector3(0, 0.68, -0.22),
  },
  completed: {
    getPosition: ratio => {
      const x = Math.min(-15, -10 / ratio)
      return new Vector3(x, 0, 0)
    },
    rotation: new Vector3(0, 2.5, 0.22),
  },
}

const setTextMeshPosition = (
  mesh: Mesh,
  { side, left, top }: TextConfig,
): void => {
  mesh.rotation.y = side === "front" ? FRONT_TEXT_ROTATION : BACK_TEXT_ROTATION
  mesh.position.x = side === "front" ? FRONT_TEXT_POSITION : BACK_TEXT_POSITION
  mesh.position.y = top
  mesh.position.z = left
}

const createTextsMesh = (
  texts: TextConfig[],
  font: Font,
  material: Material,
): Mesh => {
  const geometries = texts.map(text => {
    const geometry = new TextGeometry(text.content, {
      font,
      height: 0,
      size: text.size,
    })
    const rotation =
      text.side === "front" ? FRONT_TEXT_ROTATION : BACK_TEXT_ROTATION
    const x = text.side === "front" ? FRONT_TEXT_POSITION : BACK_TEXT_POSITION
    geometry.rotateY(rotation)
    geometry.translate(x, text.top, text.left)

    return geometry
  })

  const mergedGeometries = BufferGeometryUtils.mergeBufferGeometries(geometries)

  return new Mesh(mergedGeometries, material)
}

const getGeometrySize = (geometry: BufferGeometry): Vector3 => {
  const box = new Box3()
  box.setFromBufferAttribute(geometry.attributes.position as BufferAttribute)
  const x = box.max.x - box.min.x
  const y = box.max.y - box.min.y
  const z = box.max.z - box.min.z
  return new Vector3(x, y, z)
}

const getObjectSize = (object: Object3D): Vector3 => {
  const box = new Box3()
  box.setFromObject(object)
  const x = box.max.x - box.min.x
  const y = box.max.y - box.min.y
  const z = box.max.z - box.min.z
  return new Vector3(x, y, z)
}

const createMeasureMesh = (
  width: number,
  height: number,
  font: Font,
  material: Material,
): Mesh => {
  const displayedWidth = `${Math.round(width * 10)}mm`
  const displayedHeight = `${Math.round(height * 10)}mm`

  const heightGeometry = new TextGeometry(displayedHeight, {
    font,
    size: 0.15,
    height: 0,
    curveSegments: 6,
  })
  const heightGeometrySize = getGeometrySize(heightGeometry)
  const heightTranslateX = 3.5 - heightGeometrySize.x - width
  const heightTranslateY = 2.5 - LOGO_MARGIN_TOP
  heightGeometry.translate(heightTranslateX, heightTranslateY, 0)

  const widthGeometry = new TextGeometry(displayedWidth, {
    font,
    size: 0.15,
    height: 0,
    curveSegments: 6,
  })
  const widthGeometrySize = getGeometrySize(widthGeometry)
  const widthTranslateX = 4.2 - widthGeometrySize.x - LOGO_MARGIN_RIGHT
  const widthTranslateY = 2 - height
  widthGeometry.translate(widthTranslateX, widthTranslateY, 0)

  const sizeGeometry = BufferGeometryUtils.mergeBufferGeometries([
    heightGeometry,
    widthGeometry,
  ])

  const mesh = new Mesh(sizeGeometry, material)
  mesh.rotation.y = FRONT_TEXT_ROTATION
  mesh.position.x = -0.2

  return mesh
}

type Props = {
  assets: Card3dAssets
  cameraPosition: CameraPosition
  name: string
  color: CardColor
  logo: SVGElement | null
  logoScale: number
}

export const CardCanvas: React.FC<Props> = memo(
  ({ assets, cameraPosition, name, color, logo, logoScale }) => {
    const container = useRef<HTMLDivElement | null>(null)
    // use cameraPositionRef for resizing
    const cameraPositionRef = useRef(cameraPosition)
    const size = useLazyRef(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }))
    const canvas = useLazyRef(() => document.createElement("canvas"))
    const mounted = useRef(false)
    const renderer = useThreejsObject(() => {
      const renderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true,
      })
      renderer.physicallyCorrectLights = true
      renderer.outputEncoding = sRGBEncoding
      renderer.toneMapping = ReinhardToneMapping
      renderer.toneMappingExposure = 3
      return renderer
    })
    const scene = useLazyRef(() => new Scene())
    const cameraGroup = useLazyRef(() => new Group())
    const camera = useLazyRef(() => {
      const camera = new PerspectiveCamera(
        50,
        size.width / size.height,
        0.1,
        100,
      )
      const { getPosition, rotation } = cameraPositions[cameraPosition]
      const position = getPosition(size.width / size.height)
      camera.position.set(position.x, position.y, position.z)
      cameraGroup.rotation.set(rotation.x, rotation.y, rotation.z)
      return camera
    })
    const cameraPositionAnimation = useLazyRef(() => animate(camera.position))
    // we rotate cameraGroup instead of camera to have arc circle curve rotation around the card
    const cameraRotationAnimation = useLazyRef(() =>
      animate(cameraGroup.rotation),
    )
    const orbitControls = useLazyRef(() => {
      const controls = new OrbitControls(camera, canvas)
      controls.enablePan = false
      controls.maxDistance = 30
      controls.minDistance = 5
      controls.enabled = false
      controls.enableDamping = true
      controls.dampingFactor = 0.1
      controls.rotateSpeed = 2
      return controls
    })
    const gradientMesh = useMesh(
      () =>
        new Mesh(
          new PlaneBufferGeometry(2, 2, 1, 1),
          new RawShaderMaterial({
            uniforms: {
              uRatio: { value: size.width / size.height },
              uPosition: { value: new Vector2(0.5, 0.5) },
            },
            vertexShader: gradientVertexShader,
            fragmentShader: gradientFragmentShader,
          }),
        ),
    )
    const cardColorPercent = useLazyRef(() => ({
      value: color === "silver" ? 0 : 1,
    }))
    const cardMaterial = useThreejsObject(() => {
      const material = new MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.35,
        envMapIntensity: ENV_MAP_INTENSITY,
        map: assets.cardTextures.silver,
      })
      material.onBeforeCompile = shader => {
        shader.uniforms.uPercent = cardColorPercent
        shader.uniforms.map2 = { value: assets.cardTextures.black }
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_pars_fragment>",
          mapParsFragmentShader,
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_fragment>",
          mapFragmentShader,
        )
      }
      return material
    })
    const logoMaterial = useThreejsObject(
      () =>
        new MeshStandardMaterial({
          color: 0x000000,
          metalness: 0.1,
          roughness: 0.35,
          envMapIntensity: ENV_MAP_INTENSITY,
          transparent: true,
        }),
    )
    const textPrimaryMaterial = useThreejsObject<MeshStandardMaterial>(
      () =>
        new MeshStandardMaterial({
          color: 0x000000,
          metalness: 0.1,
          roughness: 0.35,
          envMapIntensity: ENV_MAP_INTENSITY,
        }),
    )
    const textSecondaryMaterial = useThreejsObject(
      () =>
        new MeshStandardMaterial({
          color: 0x222222,
          metalness: 0.1,
          roughness: 0.35,
          envMapIntensity: ENV_MAP_INTENSITY,
        }),
    )
    const measureTextMaterial = useThreejsObject(
      () =>
        new MeshStandardMaterial({
          color: 0x222222,
          metalness: 0.1,
          roughness: 0.35,
          envMapIntensity: ENV_MAP_INTENSITY,
          transparent: true,
          opacity: 0,
        }),
    )
    const logoGroup = useLazyRef(() => new Group())
    const cardColorAnimation = useLazyRef(() => animate(cardColorPercent))
    const logoColorAnimation = useLazyRef(() => animate(logoMaterial.color))
    const textColorAnimation = useLazyRef(() =>
      animate(textPrimaryMaterial.color),
    )
    const measureOpacityAnimation = useLazyRef(() =>
      animate(measureTextMaterial),
    )

    const setSize = () => {
      size.width = window.innerWidth
      size.height = window.innerHeight

      // Set pixel ratio to 2 maximum
      const pixelRatio = Math.min(devicePixelRatio, 2)
      const aspectRatio = size.width / size.height

      // Set ratio for gradient background
      gradientMesh.material.uniforms.uRatio.value = aspectRatio

      // Update camera
      camera.aspect = aspectRatio
      camera.updateProjectionMatrix()
      renderer.setSize(size.width, size.height)
      const { x: cameraX, y: cameraY, z: cameraZ } = cameraPositions[
        cameraPositionRef.current
      ].getPosition(size.width / size.height)
      camera.position.set(cameraX, cameraY, cameraZ)

      renderer.setPixelRatio(pixelRatio)
    }

    // Add canvas in DOM
    useEffect(() => {
      canvas.className = `${styles.canvas} ${styles.canvas_hidden}`
      container.current?.appendChild(canvas)

      // wait a little before removing hidden class and play opacity animation
      const timeout = setTimeout(() => {
        canvas.className = styles.canvas
      }, 100)

      return () => {
        clearTimeout(timeout)
      }
    }, [])

    // Handle window size
    useEffect(() => {
      setSize()

      const handleResize = () => setSize()
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])

    // set scene env, add objects and lights
    useEffect(() => {
      // const axes = new AxesHelper(3)
      // scene.add(axes)

      // add camera in camera group for camera rotation animation
      cameraGroup.add(camera)
      scene.add(cameraGroup)

      // Set scene environment
      scene.background = new Color(0xffffff)
      scene.environment = assets.environmentMap

      // Add ambiant light
      const ambientLight = new AmbientLight(0xffffff, 2)
      // Add 2 point light to add some reflections
      const pointDecay = 2
      const pointIntensity = 2000
      const pointX = 100
      const pointY = 10
      const pointZ = 21
      const pointLightFront = new PointLight(0xffffff)
      pointLightFront.decay = pointDecay
      pointLightFront.intensity = pointIntensity
      pointLightFront.position.set(-pointX, pointY, -pointZ)
      const pointLightBack = new PointLight(0xffffff)
      pointLightBack.decay = pointDecay
      pointLightBack.intensity = pointIntensity
      pointLightBack.position.set(pointX, pointY, pointZ)

      scene.add(ambientLight, pointLightFront, pointLightBack)

      // Create logo group which help for logo resizing (change transform origin)
      logoGroup.position.x = FRONT_TEXT_POSITION
      logoGroup.position.y = 2.7 - LOGO_MARGIN_TOP
      logoGroup.position.z = 4.28 - LOGO_MARGIN_RIGHT
      scene.add(logoGroup)

      // Create gradient background
      scene.add(gradientMesh)

      // Create and add text on card
      const primaryTextsMesh = createTextsMesh(
        primaryTexts,
        assets.font,
        textPrimaryMaterial,
      )
      const secondaryTextsMesh = createTextsMesh(
        secondaryTexts,
        assets.font,
        textSecondaryMaterial,
      )
      scene.add(primaryTextsMesh)
      scene.add(secondaryTextsMesh)

      // Add gltf model
      assets.gltf.scene.traverse(child => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial
        ) {
          // set custom material for card to handle color change with custom effect
          if (child.name === "card") {
            child.material = cardMaterial
          }

          child.material.envMapIntensity = ENV_MAP_INTENSITY
          child.material.needsUpdate = true
        }
      })
      scene.add(assets.gltf.scene)
    }, [])

    // Render scene
    useEffect(() => {
      const clock = new Clock()

      const tick = () => {
        // update orbitControls for damping
        if (orbitControls.enabled) {
          orbitControls.update()
        }

        // update gradient position
        const elaspedTime = clock.getElapsedTime()
        gradientMesh.material.uniforms.uPosition.value.x = interpolateCos(
          Math.cos(elaspedTime * 0.2),
        )
        gradientMesh.material.uniforms.uPosition.value.y = interpolateCos(
          Math.cos(elaspedTime * 0.2),
        )

        // Render
        renderer.render(scene, camera)
        frame = requestAnimationFrame(tick)
      }

      let frame = requestAnimationFrame(tick)

      return () => {
        cancelAnimationFrame(frame)
      }
    }, [])

    // Update camera position
    useEffect(() => {
      // update ref
      cameraPositionRef.current = cameraPosition
      // we disable orbitControls before animation
      if (cameraPosition !== "completed") {
        orbitControls.enabled = false
      }

      const { getPosition, rotation } = cameraPositions[cameraPosition]
      const position = getPosition(size.width / size.height)
      cameraPositionAnimation.start({
        duration: 1500,
        easing: easings.easeOutExpo,
        to: {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        onComplete: () => {
          // we re-enable orbitControls after animation
          if (cameraPosition === "completed") {
            orbitControls.enabled = true
          }
        },
      })
      cameraRotationAnimation.start({
        duration: 1500,
        easing: easings.easeOutExpo,
        to: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        },
      })
    }, [cameraPosition])

    // Update text
    useEffect(() => {
      if (name && assets.font) {
        const textGeometry = new TextGeometry(name, {
          font: assets.font,
          size: nameTextConfig.size,
          height: 0,
          curveSegments: 6,
        })
        const nameMesh = new Mesh(textGeometry, textPrimaryMaterial)
        setTextMeshPosition(nameMesh, nameTextConfig)

        scene.add(nameMesh)

        return () => {
          scene.remove(nameMesh)
          textGeometry.dispose()
        }
      }
    }, [name])

    // Update color
    useEffect(() => {
      if (!mounted.current) return

      cardColorAnimation.start({
        duration: 1000,
        easing: easings.easeOutCubic,
        to: { value: color === "silver" ? 0 : 1 },
      })
      logoColorAnimation.start({
        duration: 1000,
        easing: easings.easeOutCubic,
        to: logoColors[color],
      })
      textColorAnimation.start({
        duration: 1000,
        easing: easings.easeOutCubic,
        to: logoColors[color],
      })
    }, [color])

    // Update logo
    useEffect(() => {
      if (logo) {
        const whiteLogo = getMonochromeSvg(logo, "white")
        const image = createSvgImage(whiteLogo)
        const { width: logoWidth, height: logoHeight } = computeCardLogoSize(
          image,
        )

        const alphaMap = new Texture(image)
        alphaMap.needsUpdate = true
        logoMaterial.alphaMap = alphaMap

        const geometry = new PlaneGeometry(logoWidth, logoHeight)

        const mesh = new Mesh(geometry, logoMaterial)

        const { x: width, y: height } = getGeometrySize(geometry)
        const offsetX = -width / 2
        const offsetY = -height / 2

        mesh.rotation.y = FRONT_TEXT_ROTATION
        mesh.position.set(0, offsetY, offsetX)

        logoGroup.add(mesh)

        return () => {
          logoGroup.remove(mesh)
          geometry.dispose()
          alphaMap.dispose()
        }
      }
    }, [logo])

    // Update logo scale
    useEffect(() => {
      if (!mounted.current) return

      logoGroup.scale.set(logoScale, logoScale, logoScale)

      // if logo isn't added yet, we can't measure
      if (logoGroup.children.length === 0) return

      // Get logo size
      const { z: width, y: height } = getObjectSize(logoGroup)

      // animate opacity at creation
      if (!measureOpacityAnimation.running()) {
        measureOpacityAnimation.start({
          duration: 100,
          to: { opacity: 1 },
        })
      }

      // Create mesh with measured values
      const logoMeasureMesh = createMeasureMesh(
        width,
        height,
        assets.font,
        measureTextMaterial,
      )

      scene.add(logoMeasureMesh)

      const timeout = setTimeout(() => {
        measureOpacityAnimation.start({
          duration: 300,
          to: { opacity: 0 },
          onComplete: () => {
            // remove and dispose mesh at animation end
            if (logoMeasureMesh) {
              scene.remove(logoMeasureMesh)
              logoMeasureMesh.geometry.dispose()
            }
          },
        })
      }, 1000)

      return () => {
        scene.remove(logoMeasureMesh)
        logoMeasureMesh.geometry.dispose()
        clearTimeout(timeout)
      }
    }, [logoScale])

    useEffect(() => {
      mounted.current = true
    }, [])

    return <div ref={container} className={styles.container} />
  },
)
