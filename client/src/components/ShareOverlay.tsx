import { AsyncData, Result } from "@swan-io/boxed";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { Space } from "@swan-io/lake/src/components/Space";
import { colors } from "@swan-io/lake/src/constants/design";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { match } from "ts-pattern";
import { t } from "../utils/i18n";
import { convertStringToSvg } from "../utils/svg";

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

type Props = {
  configId: string;
  onLoaded: (config: CardConfig) => void;
};

export const ShareOverlay = ({ configId, onLoaded }: Props) => {
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

        const data = await response.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        const svg = convertStringToSvg(data.logo); // eslint-disable-line
        return {
          ok: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: {
            ...data,
            logo: svg,
          },
        };
      })
      .then(result => {
        match(result)
          .with({ ok: true }, ({ data }) => {
            setState(AsyncData.Done(Result.Ok(undefined)));
            // "/api/config/:id" returns a CardConfig if request is successful
            onLoaded(data); // eslint-disable-line @typescript-eslint/no-unsafe-argument
          })
          .with({ ok: false }, () => {
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
        Ok: () => <View />,
        Error: () => (
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
            </View>
          </View>
        ),
      }),
  });
};
