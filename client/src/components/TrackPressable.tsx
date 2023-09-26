import { cloneElement } from "react";
import { trackClickEvent } from "../utils/googleTagManager";

type Props = {
  name: string;
  children: React.ReactElement<{ onPress?: () => void }>;
};

export const TrackPressable = ({ name, children }: Props) => {
  return cloneElement(children, {
    onPress: () => {
      trackClickEvent(name);
      children.props.onPress?.();
    },
  });
};
