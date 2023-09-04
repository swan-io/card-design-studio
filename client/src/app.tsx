import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { ToastStack } from "@swan-io/lake/src/components/ToastStack";
import { Suspense, lazy, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { P, match } from "ts-pattern";
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

  const handleConfigLoaded = useCallback((config: CardConfig) => {
    setName(config.name);
    setColor(config.color);
    setLogo(config.logo);
    setLogoScale(config.logoScale);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Suspense fallback={<LoadingView />}>
          <Card3dScene
            step={step}
            ownerName={name}
            color={color}
            logo={logo}
            logoScale={logoScale}
          />
        </Suspense>

        {match(route)
          .with({ name: "Share" }, ({ params }) => (
            <ShareOverlay
              configId={params.configId}
              onStartNewDesign={() => {
                setName("");
                setLogo(null);
                setLogoScale(1);
                setColor("Silver");
                Router.push("ConfigCard");
                setStep("name");
              }}
              onLoaded={handleConfigLoaded}
            />
          ))
          .with({ name: "ConfigCard" }, () => (
            <>
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
            </>
          ))
          .with(P.nullish, () => null)
          .exhaustive()}
      </View>

      <ToastStack />
    </>
  );
};
