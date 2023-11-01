import { Icon } from "@swan-io/lake/src/components/Icon";
import { LakeCopyButton } from "@swan-io/lake/src/components/LakeCopyButton";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { LakeModal } from "@swan-io/shared-business/src/components/LakeModal";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { Link } from "@swan-io/lake/src/components/Link";
import { Space } from "@swan-io/lake/src/components/Space";
import { colors } from "@swan-io/lake/src/constants/design";
import { Image, StyleSheet } from "react-native";
import linkedInIconUrl from "../assets/linkedin.svg?url";
import xIconUrl from "../assets/x.svg?url";
import { t } from "../utils/i18n";

const styles = StyleSheet.create({
  link: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textDecorationLine: "underline",
    color: colors.live[500],
  },
  logo: {
    width: 18,
    height: 18,
  },
});

type Props = {
  visible: boolean;
  configId: string;
  onPressClose: () => void;
};

export const ShareModal = ({ visible, configId, onPressClose }: Props) => {
  const sharedLink = `${window.location.origin}/share/${configId}`;
  const encodedSharedLink = encodeURIComponent(sharedLink);
  const xUrl = `https://x.com/intent/tweet?url=${encodedSharedLink}`;
  // linked accept only 1 param for sharing https://stackoverflow.com/a/61857558
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedSharedLink}`;

  return (
    <LakeModal visible={visible} title={t("shareModal.title")} onPressClose={onPressClose}>
      <LakeLabel
        label={t("shareModal.link")}
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

      <Space height={16} />

      <Link to={linkedInUrl} target="_blank" style={styles.link}>
        <Image source={{ uri: linkedInIconUrl }} style={styles.logo} alt="LinkedIn" />
        <Space width={4} />
        <LakeText color={colors.live[500]}>{t("shareModal.shareOnLinkedIn")}</LakeText>
        <Space width={4} />
        <Icon name="open-regular" size={20} color={colors.live[500]} />
      </Link>

      <Space height={16} />

      <Link to={xUrl} target="_blank" style={styles.link}>
        <Image source={{ uri: xIconUrl }} style={styles.logo} alt="X" />
        <Space width={4} />
        <LakeText color={colors.live[500]}>{t("shareModal.shareOnX")}</LakeText>
        <Space width={4} />
        <Icon name="open-regular" size={20} color={colors.live[500]} />
      </Link>
    </LakeModal>
  );
};
