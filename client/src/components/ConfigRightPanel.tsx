import { Box } from "@swan-io/lake/src/components/Box";
import { Fill } from "@swan-io/lake/src/components/Fill";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { LakeTextInput } from "@swan-io/lake/src/components/LakeTextInput";
import { Link } from "@swan-io/lake/src/components/Link";
import { RadioGroup, RadioGroupItem } from "@swan-io/lake/src/components/RadioGroup";
import { RightPanel } from "@swan-io/lake/src/components/RightPanel";
import { Slider } from "@swan-io/lake/src/components/Slider";
import { Space } from "@swan-io/lake/src/components/Space";
import { colors } from "@swan-io/lake/src/constants/design";
import { StyleSheet, View } from "react-native";
import { t } from "../utils/i18n";
import { LogoUploadArea } from "./LogoUploadArea";
import { TrackPressable } from "./TrackPressable";
import { AsyncData } from "@swan-io/boxed";

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  link: {
    textDecorationLine: "underline",
  },
});

const CUSTOM_LINK_DOCUMENTATION_URL =
  "https://docs.swan.io/help/faq/cards/can-swan-issue-cards-with-my-companys-custom-design";

type Props = {
  visible: boolean;
  ownerName: string;
  color: CardConfig["color"];
  logoFile: AsyncData<File>;
  logoScale: number;
  onOwnerNameChange: (ownerName: string) => void;
  onColorChange: (color: CardConfig["color"]) => void;
  onLogoChange: (logo: SVGElement | HTMLImageElement, file: File) => void;
  onLogoScaleChange: (logoScale: number) => void;
  onClose: () => void;
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
  {
    name: t("step.color.custom"),
    value: "Custom",
  },
];

export const ConfigRightPanel = ({
  visible,
  ownerName,
  color,
  logoFile,
  logoScale,
  onOwnerNameChange,
  onColorChange,
  onLogoChange,
  onLogoScaleChange,
  onClose,
}: Props) => (
  <RightPanel visible={visible} onPressClose={onClose}>
    <View style={styles.container}>
      <LakeHeading level={1} variant="h3">
        {t("rightPanel.title")}
      </LakeHeading>

      <Space height={24} />

      <LakeLabel
        label={t("step.name.label")}
        render={id => (
          <LakeTextInput
            id={id}
            value={ownerName}
            placeholder="Roland Moreno"
            onChangeText={onOwnerNameChange}
          />
        )}
      />

      <LogoUploadArea logoFile={logoFile} onChange={onLogoChange} />
      <Space height={24} />

      <LakeLabel
        label={t("step.logo.size.label")}
        render={() => (
          <Slider
            minimum={0}
            maximum={1}
            step={0.01}
            value={logoScale}
            onValueChange={onLogoScaleChange}
          />
        )}
      />

      <Space height={24} />

      <LakeLabel
        type="radioGroup"
        label={t("step.color.label")}
        render={() => <RadioGroup value={color} items={colorItems} onValueChange={onColorChange} />}
      />

      <Space height={4} />

      <Link to={CUSTOM_LINK_DOCUMENTATION_URL} target="_blank" style={styles.link}>
        <LakeText color={colors.live[500]}>{t("step.color.moreAboutCustom")}</LakeText>
      </Link>

      <Fill minHeight={24} />

      <Box alignItems="end">
        <TrackPressable name="close-right-panel">
          <LakeButton color="live" onPress={onClose}>
            {t("rightPanel.close")}
          </LakeButton>
        </TrackPressable>
      </Box>
    </View>
  </RightPanel>
);
