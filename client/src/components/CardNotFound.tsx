import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { Space } from "@swan-io/lake/src/components/Space";
import { colors } from "@swan-io/lake/src/constants/design";
import { StyleSheet, View } from "react-native";
import { t } from "../utils/i18n";
import { TrackPressable } from "./TrackPressable";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray[0],
  },
  errorContainer: {
    margin: "auto",
  },
  reloadButton: {
    alignSelf: "flex-start",
  },
});

export const CardNotFound = () => {
  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <LakeHeading level={1} variant="h1">
          {t("share.failedToLoad.title")}
        </LakeHeading>

        <Space height={16} />

        <LakeHeading level={2} variant="h3" color={colors.gray[600]}>
          {t("share.failedToLoad.subtitle")}
        </LakeHeading>

        <Space height={16} />

        <TrackPressable name="share.reload-after-failure">
          <LakeButton
            color="live"
            size="small"
            icon="arrow-counterclockwise-filled"
            iconPosition="end"
            style={styles.reloadButton}
            onPress={() => {
              window.location.reload();
            }}
          >
            {t("share.failedToLoad.reload")}
          </LakeButton>
        </TrackPressable>
      </View>
    </View>
  );
};
