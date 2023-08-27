import { LakeCopyButton } from "@swan-io/lake/src/components/LakeCopyButton";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { LakeModal } from "@swan-io/lake/src/components/LakeModal";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { colors } from "@swan-io/lake/src/constants/design";
import { t } from "../utils/i18n";

type Props = {
  visible: boolean;
  configId: string;
  onPressClose: () => void;
};

export const ShareModal = ({ visible, configId, onPressClose }: Props) => {
  const sharedLink = `${window.location.origin}/share/${configId}`;

  return (
    <LakeModal
      visible={visible}
      title={t("step.completed.shareModalTitle")}
      onPressClose={onPressClose}
    >
      <LakeLabel
        label={t("step.completed.shareLink")}
        type="view"
        color="live"
        render={() => <LakeText color={colors.gray[900]}>{sharedLink}</LakeText>}
        actions={
          <LakeCopyButton
            valueToCopy={sharedLink}
            copyText={t("copyButton.copyTooltip")}
            copiedText={t("copyButton.copiedTooltip")}
          />
        }
      />
    </LakeModal>
  );
};
