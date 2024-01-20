import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { colors } from "@swan-io/lake/src/constants/design";
import { StyleSheet, View } from "react-native";
import { useCardConfig } from "../utils/cardConfig";
import { CardNotFound } from "./CardNotFound";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray[0],
  },
});

type Props = {
  configId: string;
  onLoaded: (config: CardConfig) => void;
};

export const LoadConfigOverlay = ({ configId, onLoaded }: Props) => {
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
        Ok: () => null,
        Error: () => <CardNotFound />,
      }),
  });
};
