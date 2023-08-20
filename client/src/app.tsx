import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { Suspense, lazy, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ColorStep,
  CompletedStep,
  LogoStep,
  NameStep,
  WelcomeStep,
} from "./components/ConfigSteps";
import { ShareOverlay } from "./components/ShareOverlay";
import { Router } from "./utils/routes";
const Card3dScene = lazy(() => import("./components/Card3dScene"));

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export const App = () => {
  const route = Router.useRoute(["ConfigCard", "Share"]);
  const [step, setStep] = useState<ConfigStep>(() =>
    route?.name === "Share" ? "share" : "welcome",
  );
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<SVGElement | null>(null);
  const [logoScale, setLogoScale] = useState(1);
  const [color, setColor] = useState<CardConfig["color"]>("Silver");

  return (
    <View style={styles.container}>
      <Suspense fallback={<LoadingView />}>
        <Card3dScene step={step} ownerName={name} color={color} logo={logo} logoScale={logoScale} />
      </Suspense>

      {route?.name === "Share" && (
        <ShareOverlay
          configId={route.params.configId}
          onLoaded={config => {
            setName(config.name);
            setColor(config.color);
            setLogo(config.logo);
            setLogoScale(config.logoScale);
          }}
        />
      )}

      <WelcomeStep visible={step === "welcome"} onStart={() => setStep("name")} />

      <NameStep
        visible={step === "name"}
        name={name}
        onNameChange={setName}
        onNext={() => setStep("logo")}
      />

      <LogoStep
        visible={step === "logo"}
        logo={logo}
        logoScale={logoScale}
        onLogoChange={setLogo}
        onLogoScaleChange={setLogoScale}
        onPrevious={() => setStep("name")}
        onNext={() => setStep("color")}
      />

      <ColorStep
        visible={step === "color"}
        color={color}
        onColorChange={setColor}
        onPrevious={() => setStep("logo")}
        onNext={() => setStep("completed")}
      />

      <CompletedStep
        visible={step === "completed"}
        ownerName={name}
        color={color}
        logo={logo}
        logoScale={logoScale}
        onOwnerNameChange={setName}
        onLogoChange={setLogo}
        onLogoScaleChange={setLogoScale}
        onColorChange={setColor}
      />
    </View>
  );
};
