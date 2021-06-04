import { CubeTexture, Font, Texture } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

export type Card3dAssets = {
  gltf: GLTF
  environmentMap: CubeTexture
  cardTextures: {
    silver: Texture
    black: Texture
  }
  fonts: {
    maisonNeue: Font
    markPro: Font
  }
}
