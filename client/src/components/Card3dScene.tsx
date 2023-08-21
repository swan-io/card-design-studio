import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
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
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

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

// Camera positions
const cameraPositions: Record<
  ConfigStep,
  { getPosition: (ratio: number) => Vector3; rotation: Vector3 }
> = {
  welcome: {
    getPosition: _ratio => {
      return new Vector3(0, 0, 12);
    },
    rotation: new Vector3(0, 0, 0),
  },
  name: {
    getPosition: ratio => {
      const z = 6 / Math.min(1, ratio);
      return new Vector3(-2, -1.5, z);
    },
    rotation: new Vector3(0, 0, 0),
  },
  logo: {
    getPosition: ratio => {
      const z = 10 / Math.min(1, ratio);
      const y = -5.8 + 4 * Math.min(1, ratio);
      return new Vector3(0, y, z);
    },
    rotation: new Vector3(0, 0, 0),
  },
  color: {
    getPosition: ratio => {
      const z = 16 / Math.min(1, ratio * 1.7);
      return new Vector3(0.5, -1, z);
    },
    rotation: new Vector3(0, 0.6, 0.02),
  },
  completed: {
    getPosition: ratio => {
      const z = 16 / Math.min(1, ratio * 1.7);
      return new Vector3(-0.5, -1, z);
    },
    rotation: new Vector3(-0.02, 2.6, 0),
  },
  share: {
    getPosition: _ratio => {
      return new Vector3(0, 0, 12);
    },
    rotation: new Vector3(0, 0, 0),
  },
};

type Props = {
  step: ConfigStep;
  ownerName: string;
  color: CardConfig["color"];
  logo: SVGElement | null;
  logoScale: number;
};

export default ({ step, ownerName, color, logo, logoScale }: Props) => (
  <Canvas>
    <CardScene step={step} ownerName={ownerName} color={color} logo={logo} logoScale={logoScale} />
  </Canvas>
);

const CardScene = ({ step, ownerName, color, logo, logoScale }: Props) => {
  const cardRef = useRef<THREE.Group>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const camera = useThree(state => state.camera);
  const ratioRef = useRef(1);
  const stepRef = useRef(step);
  const [orbitEnabled] = useState(() => step === "share");

  // Change camera position on resize
  useThree(({ size }) => {
    ratioRef.current = size.width / size.height;
    const { getPosition } = cameraPositions[stepRef.current];
    const position = getPosition(ratioRef.current);
    camera.position.set(position.x, position.y, position.z);
  });

  // Change camera position and rotation on step change
  useEffect(() => {
    stepRef.current = step;
    const { getPosition, rotation } = cameraPositions[stepRef.current];
    const position = getPosition(ratioRef.current);
    camera.position.set(position.x, position.y, position.z);
    cameraGroupRef.current?.rotation.set(rotation.x, rotation.y, rotation.z);

    // setOrbitEnabled(step === "completed" || step === "share");
  }, [step, camera]);

  return (
    <>
      {/* use group to rotate the camera around scene center independantly from camera position */}
      <group ref={cameraGroupRef}>
        <PerspectiveCamera makeDefault={true} position={[0, 0, 12]} fov={50} far={100} near={0.1} />
      </group>

      <OrbitControls enablePan={false} enableZoom={false} enabled={orbitEnabled} />
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
        ref={cardRef}
        cardNumber="1234 5678 9012 3456"
        ownerName={ownerName}
        color={color}
        expirationDate="12/24"
        cvv="123"
        logo={logo}
        logoScale={logoScale}
        assetsUrls={assetsUrls}
      />
    </>
  );
};
