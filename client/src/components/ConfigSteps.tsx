import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { LakeTextInput } from "@swan-io/lake/src/components/LakeTextInput";
import { Tile } from "@swan-io/lake/src/components/Tile";
import { TransitionView } from "@swan-io/lake/src/components/TransitionView";
import { animations } from "@swan-io/lake/src/constants/design";
import { StyleSheet } from "react-native";
import { t } from "../utils/i18n";

const styles = StyleSheet.create({
  stepContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

type WelcomeStepProps = {
  visible: boolean;
  onStart: () => void;
};

export const WelcomeStep = ({ visible, onStart }: WelcomeStepProps) => (
  <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromRight}>
    {visible ? (
      <Tile>
        <LakeButton onPress={onStart}>{t("welcome.button")}</LakeButton>
      </Tile>
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
  <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromRight}>
    {visible ? (
      <Tile>
        <LakeTextInput value={name} onChangeText={onNameChange} />
        <LakeButton onPress={onNext}>{t("common.nextStep")}</LakeButton>
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

export const LogoStep = ({ visible, onPrevious, onNext }: LogoStepProps) => (
  <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromRight}>
    {visible ? (
      <Tile>
        <LakeText>LOGO STEP</LakeText>
        <LakeButton onPress={onPrevious}>{t("common.previousStep")}</LakeButton>
        <LakeButton onPress={onNext}>{t("common.nextStep")}</LakeButton>
      </Tile>
    ) : null}
  </TransitionView>
);

type ColorStepProps = {
  visible: boolean;
  color: "Silver" | "Black";
  onColorChange: (color: "Silver" | "Black") => void;
  onPrevious: () => void;
  onNext: () => void;
};

export const ColorStep = ({ visible, onPrevious, onNext }: ColorStepProps) => (
  <TransitionView style={styles.stepContainer} {...animations.fadeAndSlideInFromRight}>
    {visible ? (
      <Tile>
        <LakeText>COLOR STEP</LakeText>
        <LakeButton onPress={onPrevious}>{t("common.previousStep")}</LakeButton>
        <LakeButton onPress={onNext}>{t("common.nextStep")}</LakeButton>
      </Tile>
    ) : null}
  </TransitionView>
);
