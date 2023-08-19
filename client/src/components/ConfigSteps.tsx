import { Box } from "@swan-io/lake/src/components/Box";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { LakeTextInput } from "@swan-io/lake/src/components/LakeTextInput";
import { Space } from "@swan-io/lake/src/components/Space";
import { SwanLogo } from "@swan-io/lake/src/components/SwanLogo";
import { Tile } from "@swan-io/lake/src/components/Tile";
import { TransitionView } from "@swan-io/lake/src/components/TransitionView";
import { animations, colors } from "@swan-io/lake/src/constants/design";
import { StyleSheet, View } from "react-native";
import { t } from "../utils/i18n";

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
  <TransitionView style={styles.welcomeContainer} {...animations.fadeAndSlideInFromRight}>
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
