import { AsyncData, Result } from "@swan-io/boxed";
import { Box } from "@swan-io/lake/src/components/Box";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { Space } from "@swan-io/lake/src/components/Space";
import { colors } from "@swan-io/lake/src/constants/design";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { P, match } from "ts-pattern";
import { Except } from "type-fest";
import { t } from "../utils/i18n";
import { convertStringToSvg } from "../utils/svg";
import { ShareModal } from "./ShareModal";
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

type ConfigApiResponse = Except<CardConfig, "logo"> & {
  logo: string;
};

export const ShareOverlay = ({ configId, onStartNewDesign, onLoaded }: Props) => {
  const [state, setState] = useState<AsyncData<Result<void, unknown>>>(AsyncData.NotAsked());

  useEffect(() => {
    setState(AsyncData.Loading());

    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`/api/config/${configId}`, { signal })
      .then(async response => {
        if (!response.ok) {
          return { ok: false };
        }

        const data: ConfigApiResponse = await response.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

        const logo = match(data.logo)
          .with(P.string.startsWith("<svg"), svg => convertStringToSvg(svg))
          .otherwise(base64Uri => {
            // if logo does not start with <svg, it is a base64 encoded png
            const image = new Image();
            image.src = base64Uri;
            return image;
          });

        return {
          ok: true,
          data: {
            ...data,
            logo,
          },
        };
      })
      .then(result => {
        match(result)
          .with({ data: P.not(P.nullish) }, ({ data }) => {
            setState(AsyncData.Done(Result.Ok(undefined)));
            // "/api/config/:id" returns a CardConfig if request is successful
            onLoaded(data);
          })
          .otherwise(() => {
            setState(AsyncData.Done(Result.Error(undefined)));
          });
      })
      .catch(error => {
        console.error(error);
        setState(AsyncData.Done(Result.Error(undefined)));
      });

    return () => {
      abortController.abort();
    };
  }, [configId, onLoaded]);

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

const CardNotFound = () => {
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
