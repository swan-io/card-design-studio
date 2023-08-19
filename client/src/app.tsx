import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { Suspense, lazy } from "react";
import { View } from "react-native";
const Card3dScene = lazy(() => import("./components/Card3dScene"));

export const App = () => {
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={<LoadingView />}>
        <Card3dScene />
      </Suspense>
    </View>
  );
};
