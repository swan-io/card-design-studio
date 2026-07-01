import { Box } from "@swan-io/lake/src/components/Box";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { Space } from "@swan-io/lake/src/components/Space";
import { colors } from "@swan-io/lake/src/constants/design";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Except } from "type-fest";
import { t } from "../utils/i18n";
import { ShareModal } from "./ShareModal";
import { TrackPressable } from "./TrackPressable";
import { CardNotFound } from "./CardNotFound";
import { useCardConfig } from "../utils/cardConfig";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray[0],
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    maxWidth: 512,
    margin: "auto",
  },
  grow: {
    flex: 1,
  },
});

type Props = {
  configId: string;
  onStartNewDesign: () => void;
  onLoaded: (config: CardConfig) => void;
};

export const ShareOverlay = ({ configId, onStartNewDesign, onLoaded }: Props) => {
  const state = useCardConfig(configId, onLoaded);

  return state.match({
    NotAsked: () => (
      <View style={styles.container}>
        <LoadingView />
      </View>
    ),
    Loading: () => (
      <View style={styles.container}>
        <LoadingView />
      </View>
    ),
    Done: result =>
      result.match({
        Ok: () => <ShareOverlayContent configId={configId} onStartNewDesign={onStartNewDesign} />,
        Error: () => <CardNotFound />,
      }),
  });
};

const ShareOverlayContent = ({ configId, onStartNewDesign }: Except<Props, "onLoaded">) => {
  const [shareModalOpened, setShareModalOpened] = useState(false);

  return (
    <>
      <Box direction="row" style={styles.buttonsContainer}>
        <TrackPressable name="share.create-new-design">
          <LakeButton
            color="live"
            mode="secondary"
            icon="edit-regular"
            style={styles.grow}
            onPress={onStartNewDesign}
          >
            {t("share.createNewDesign")}
          </LakeButton>
        </TrackPressable>

        <Space width={16} />

        <TrackPressable name="share.share-design">
          <LakeButton
            color="live"
            icon="arrow-upload-filled"
            style={styles.grow}
            onPress={() => {
              setShareModalOpened(true);
            }}
          >
            {t("share.shareDesign")}
          </LakeButton>
        </TrackPressable>
      </Box>

      <ShareModal
        visible={shareModalOpened}
        configId={configId}
        onPressClose={() => setShareModalOpened(false)}
      />
    </>
  );
};
