import { AsyncData } from "@swan-io/boxed";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { Link } from "@swan-io/lake/src/components/Link";
import { colors } from "@swan-io/lake/src/constants/design";
import { UploadArea } from "@swan-io/shared-business/src/components/UploadArea";
import { useState } from "react";
import { match } from "ts-pattern";
import { t } from "../utils/i18n";
import {
  convertPngFileToBase64Uri,
  convertStringToSvg,
  convertSvgFileToString,
  getMonochromeSvg,
} from "../utils/svg";
import { Space } from "@swan-io/lake/src/components/Space";
import { StyleSheet } from "react-native";

const LOGO_MAX_SIZE = (1024 * 1024) / 2; // 512KB

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
  },
});

type Props = {
  logoFile: AsyncData<File>;
  onChange: (logo: SVGElement | HTMLImageElement, file: File) => void;
};

export const LogoUploadArea = ({ logoFile, onChange }: Props) => {
  const [error, setError] = useState<string>();

  const handleLogoDrop = ([file]: File[]) => {
    match(file)
      .with({ type: "image/svg+xml" }, file => {
        convertSvgFileToString(file)
          .then(convertStringToSvg)
          .then(svg => getMonochromeSvg(svg, "black"))
          .then(svg => {
            onChange(svg, file);
          })
          .then(() => {
            setError(undefined);
          })
          .catch(error => {
            console.error(error);
            setError(t("step.logo.error"));
          });
      })
      .with({ type: "image/png" }, file => {
        convertPngFileToBase64Uri(file)
          .then(base64Uri => {
            const image = new Image();
            image.src = base64Uri;
            return image;
          })
          .then(image => {
            onChange(image, file);
          })
          .catch(error => {
            console.error(error);
            setError(t("step.logo.error"));
          });
      })
      .otherwise(() => {
        setError(t("step.logo.error"));
      });
  };

  return (
    <LakeLabel
      label={t("step.logo.label")}
      render={() => (
        <UploadArea
          accept={["image/svg+xml", "image/png"]}
          error={error}
          maxSize={LOGO_MAX_SIZE}
          onDropAccepted={handleLogoDrop}
          onDropRejected={() => setError(t("step.logo.invalidFormat"))}
          icon="arrow-download-filled"
          description={t("step.logo.description")}
          value={logoFile}
        />
      )}
      help={
        <LakeText color={colors.gray[700]}>
          {t("step.logo.help")}

          <Space width={4} />

          <Link to="https://docs.swan.io/help/faq/cards" target="_blank" style={styles.link}>
            <LakeText color={colors.live[500]}>{t("step.logo.helpLink")}</LakeText>
          </Link>
        </LakeText>
      }
    />
  );
};
