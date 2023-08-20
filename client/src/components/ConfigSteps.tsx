import { Box } from "@swan-io/lake/src/components/Box";
import { Fill } from "@swan-io/lake/src/components/Fill";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { LakeTextInput } from "@swan-io/lake/src/components/LakeTextInput";
import { RadioGroup, RadioGroupItem } from "@swan-io/lake/src/components/RadioGroup";
import { Slider } from "@swan-io/lake/src/components/Slider";
import { Space } from "@swan-io/lake/src/components/Space";
import { SwanLogo } from "@swan-io/lake/src/components/SwanLogo";
import { Tile } from "@swan-io/lake/src/components/Tile";
import { TransitionView } from "@swan-io/lake/src/components/TransitionView";
import { animations, colors } from "@swan-io/lake/src/constants/design";
import { isNullish } from "@swan-io/lake/src/utils/nullish";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { t } from "../utils/i18n";
import { ConfigRightPanel } from "./ConfigRightPanel";
import { SvgUploadArea } from "./SvgUploadArea";

const styles = StyleSheet.create({
  welcomeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray[0],
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeStep: {
    maxWidth: 700,
  },
  welcomeSwanLogo: {
    width: 98,
    height: 22,
  },
  startButton: {
    alignSelf: "flex-start",
  },
  stepContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    width: 512,
    margin: "auto",
  },
  tile: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  nameNextButton: {
    alignSelf: "flex-end",
  },
});

type WelcomeStepProps = {
  visible: boolean;
  onStart: () => void;
};

export const WelcomeStep = ({ visible, onStart }: WelcomeStepProps) => (
  <TransitionView style={styles.welcomeContainer} {...animations.fadeAndSlideInFromTop}>
    {visible ? (
      <View style={styles.welcomeStep}>
        <Box direction="row" alignItems="center">
          <SwanLogo style={styles.welcomeSwanLogo} />
          <Space width={16} />

          <LakeHeading level={1} variant="h1">
            {t("welcome.title")}
          </LakeHeading>
        </Box>

        <Space height={16} />

        <LakeHeading level={2} variant="h3" color={colors.gray[600]}>
          {t("welcome.subtitle")}
        </LakeHeading>

        <Space height={32} />

        <LakeButton
          color="live"
          icon="arrow-right-filled"
          iconPosition="end"
          style={styles.startButton}
          onPress={onStart}
        >
          {t("welcome.button")}
        </LakeButton>
      </View>
    ) : null}
  </TransitionView>
);

type NameStepProps = {
  visible: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
};

export const NameStep = ({ visible, name, onNameChange, onNext }: NameStepProps) => (
  <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromTop}>
    {visible ? (
      <Tile style={styles.tile}>
        <LakeLabel
          label={t("step.name.label")}
          render={id => (
            <LakeTextInput
              id={id}
              value={name}
              placeholder="Roland Moreno"
              onChangeText={onNameChange}
            />
          )}
        />

        <LakeButton
          icon="arrow-right-filled"
          iconPosition="end"
          color="live"
          size="small"
          style={styles.nameNextButton}
          onPress={onNext}
        >
          {t("common.nextStep")}
        </LakeButton>
      </Tile>
    ) : null}
  </TransitionView>
);

type LogoStepProps = {
  visible: boolean;
  logo: SVGElement | null;
  logoScale: number;
  onLogoChange: (logo: SVGElement) => void;
  onLogoScaleChange: (logoScale: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export const LogoStep = ({
  visible,
  logo,
  logoScale,
  onLogoChange,
  onLogoScaleChange,
  onPrevious,
  onNext,
}: LogoStepProps) => {
  return (
    <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromTop}>
      {visible ? (
        <Tile style={styles.tile}>
          <SvgUploadArea logo={logo} onChange={onLogoChange} />
          <Space height={24} />

          <LakeLabel
            label={t("step.logoSize.label")}
            render={() => (
              <Slider
                disabled={isNullish(logo)}
                minimum={0}
                maximum={1}
                step={0.01}
                value={logoScale}
                onValueChange={onLogoScaleChange}
              />
            )}
          />

          <Space height={24} />

          <Box direction="row" alignItems="center">
            <LakeButton
              ariaLabel={t("common.previousStep")}
              mode="secondary"
              icon="chevron-left-filled"
              color="live"
              size="small"
              onPress={onPrevious}
            />

            <Fill minWidth={8} />

            <LakeButton
              icon="arrow-right-filled"
              iconPosition="end"
              color="live"
              size="small"
              disabled={isNullish(logo)}
              onPress={onNext}
            >
              {t("common.nextStep")}
            </LakeButton>
          </Box>
        </Tile>
      ) : null}
    </TransitionView>
  );
};

type ColorStepProps = {
  visible: boolean;
  color: "Silver" | "Black";
  onColorChange: (color: "Silver" | "Black") => void;
  onPrevious: () => void;
  onNext: () => void;
};

const colorItems: RadioGroupItem<CardConfig["color"]>[] = [
  {
    name: t("step.color.silver"),
    value: "Silver",
  },
  {
    name: t("step.color.black"),
    value: "Black",
  },
];

export const ColorStep = ({
  visible,
  color,
  onColorChange,
  onPrevious,
  onNext,
}: ColorStepProps) => (
  <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromTop}>
    {visible ? (
      <Tile style={styles.tile}>
        <LakeLabel
          type="radioGroup"
          label={t("step.color.label")}
          render={() => (
            <RadioGroup value={color} items={colorItems} onValueChange={onColorChange} />
          )}
        />

        <Space height={24} />

        <Box direction="row" alignItems="center">
          <LakeButton
            ariaLabel={t("common.previousStep")}
            mode="secondary"
            icon="chevron-left-filled"
            color="live"
            size="small"
            onPress={onPrevious}
          />

          <Fill minWidth={8} />

          <LakeButton
            icon="arrow-right-filled"
            iconPosition="end"
            color="live"
            size="small"
            onPress={onNext}
          >
            {t("common.confirm")}
          </LakeButton>
        </Box>
      </Tile>
    ) : null}
  </TransitionView>
);

type CompletedStepProps = {
  visible: boolean;
  ownerName: string;
  color: CardConfig["color"];
  logo: SVGElement | null;
  logoScale: number;
  onOwnerNameChange: (ownerName: string) => void;
  onColorChange: (color: CardConfig["color"]) => void;
  onLogoChange: (logo: SVGElement) => void;
  onLogoScaleChange: (logoScale: number) => void;
};

export const CompletedStep = ({
  visible,
  ownerName,
  color,
  logo,
  logoScale,
  onOwnerNameChange,
  onColorChange,
  onLogoChange,
  onLogoScaleChange,
}: CompletedStepProps) => {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromTop}>
        {visible ? (
          <LakeButton color="live" icon="edit-regular" onPress={() => setEditing(true)}>
            {t("step.completed.edit")}
          </LakeButton>
        ) : null}
      </TransitionView>

      <ConfigRightPanel
        visible={editing}
        ownerName={ownerName}
        color={color}
        logo={logo}
        logoScale={logoScale}
        onOwnerNameChange={onOwnerNameChange}
        onColorChange={onColorChange}
        onLogoChange={onLogoChange}
        onLogoScaleChange={onLogoScaleChange}
        onClose={() => setEditing(false)}
      />
    </>
  );
};
