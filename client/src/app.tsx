import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { ToastStack } from "@swan-io/lake/src/components/ToastStack";
import { Suspense, lazy, useCallback, useMemo, useState } from "react";
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
import { AsyncData } from "@swan-io/boxed";
import { isNotNullish } from "@swan-io/lake/src/utils/nullish";
import { createYourBrandSvg } from "./utils/svg";
import { LoadConfigOverlay } from "./components/LoadConfigOverlay";
const Card3dScene = lazy(() => import("./components/Card3dScene"));

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export const App = () => {
  const route = Router.useRoute(["ConfigCard", "Share", "Screenshot", "WebsiteDemo"]);
  const [step, setStep] = useState<ConfigStep>(() =>
    match(route?.name)
      .returnType<ConfigStep>()
      .with("ConfigCard", () => "welcome")
      .with("Share", () => "share")
      .with("Screenshot", () => "screenshot")
      .with("WebsiteDemo", () => "website-demo")
      .with(P.nullish, () => "welcome")
      .exhaustive(),
  );

  const [{ name, color, logo, logoScale }, setCardConfig] = useState<CardConfig>(() => {
    return match(route)
      .returnType<CardConfig>()
      .with({ name: "WebsiteDemo" }, ({ params: { cardColor, cardHolderName } }) => ({
        name: cardHolderName ?? "",
        color: match(cardColor)
          .returnType<CardConfig["color"]>()
          .with("black", () => "Black")
          .with("silver", () => "Silver")
          .with("custom", () => "Custom")
          .otherwise(() => "Black"),
        logo: createYourBrandSvg(),
        logoScale: 1,
      }))
      .otherwise(() => ({
        name: "",
        color: "Silver",
        logo: null,
        logoScale: 1,
      }));
  });

  const backgroundColor = useMemo(
    () =>
      match(route)
        .with(
          { name: "WebsiteDemo", params: { backgroundColor: P.string } },
          ({ params: { backgroundColor } }) => `#${backgroundColor}`,
        )
        .otherwise(() => undefined),
    [route],
  );

  const setName = useCallback((name: string) => setCardConfig(config => ({ ...config, name })), []);
  const setLogo = useCallback(
    (logo: SVGElement | HTMLImageElement | null) => setCardConfig(config => ({ ...config, logo })),
    [],
  );
  const setLogoScale = useCallback(
    (logoScale: number) => setCardConfig(config => ({ ...config, logoScale })),
    [],
  );
  const setColor = useCallback(
    (color: CardConfig["color"]) => setCardConfig(config => ({ ...config, color })),
    [],
  );
  const [logoFile, setLogoFile] = useState<AsyncData<File>>(AsyncData.NotAsked());

  const handleLogoChange = useCallback(
    (logo: SVGElement | HTMLImageElement, file?: File) => {
      setLogo(logo);
      if (isNotNullish(file)) {
        setLogoFile(AsyncData.Done(file));
      }
    },
    [setLogo],
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor }]}>
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
          .with({ name: "Screenshot" }, ({ params }) => (
            <LoadConfigOverlay configId={params.configId} onLoaded={setCardConfig} />
          ))
          .with({ name: "Share" }, ({ params }) => (
            <ShareOverlay
              configId={params.configId}
              onStartNewDesign={() => {
                setCardConfig({ name: "", color: "Silver", logo: null, logoScale: 1 });
                Router.push("ConfigCard");
                setStep("name");
              }}
              onLoaded={setCardConfig}
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
                logoFile={logoFile}
                logoScale={logoScale}
                onLogoChange={handleLogoChange}
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
                logoFile={logoFile}
                logoScale={logoScale}
                onOwnerNameChange={setName}
                onLogoChange={handleLogoChange}
                onLogoScaleChange={setLogoScale}
                onColorChange={setColor}
              />
            </>
          ))
          .with({ name: "WebsiteDemo" }, () => null)
          .with(P.nullish, () => null)
          .exhaustive()}
      </View>

      <ToastStack />
    </>
  );
};
