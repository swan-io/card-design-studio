import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import envNx from "@swan-io/lake/src/assets/3d-card/environment/nx.png?url";
import envNy from "@swan-io/lake/src/assets/3d-card/environment/ny.png?url";
import envNz from "@swan-io/lake/src/assets/3d-card/environment/nz.png?url";
import envPx from "@swan-io/lake/src/assets/3d-card/environment/px.png?url";
import envPy from "@swan-io/lake/src/assets/3d-card/environment/py.png?url";
import envPz from "@swan-io/lake/src/assets/3d-card/environment/pz.png?url";
import fontMaisonNeueBook from "@swan-io/lake/src/assets/3d-card/model/MaisonNeue-Book.woff?url";
import fontMarkProRegular from "@swan-io/lake/src/assets/3d-card/model/MarkPro-Regular.ttf?url";
import bandRoughness from "@swan-io/lake/src/assets/3d-card/model/band_roughness.jpg?url";
import cardGltf from "@swan-io/lake/src/assets/3d-card/model/card.gltf?url";
import chipTexture from "@swan-io/lake/src/assets/3d-card/model/chip.jpg?url";
import colorBlack from "@swan-io/lake/src/assets/3d-card/model/color_black.jpg?url";
import colorSilver from "@swan-io/lake/src/assets/3d-card/model/color_silver.jpg?url";
import type { Card3dAssetsUrls } from "@swan-io/lake/src/components/Card3dPreview";
import { Card } from "@swan-io/lake/src/components/Card3dPreview";

const assetsUrls: Card3dAssetsUrls = {
  envNx,
  envNy,
  envNz,
  envPx,
  envPy,
  envPz,
  fontMaisonNeueBook,
  fontMarkProRegular,
  bandRoughness,
  cardGltf,
  chipTexture,
  colorBlack,
  colorSilver,
};

export default () => (
  <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
    <OrbitControls enablePan={false} enableZoom={false} />
    <ambientLight color={0xffffff} intensity={1} />
    <pointLight intensity={0.2} decay={2} position={[-10, -10, -21]} />
    <pointLight intensity={0.2} decay={2} position={[10, 10, 21]} />

    <Environment
      files={[
        assetsUrls.envPx,
        assetsUrls.envNx,
        assetsUrls.envPy,
        assetsUrls.envNy,
        assetsUrls.envPz,
        assetsUrls.envNz,
      ]}
    />

    <Card
      cardNumber="1234 5678 9012 3456"
      ownerName="John Doe"
      color="Silver"
      expirationDate="12/24"
      cvv="123"
      logo={null}
      logoScale={1}
      assetsUrls={assetsUrls}
    />
  </Canvas>
);
