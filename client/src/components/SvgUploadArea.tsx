import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { UploadArea } from "@swan-io/shared-business/src/components/UploadArea";
import { useState } from "react";
import { t } from "../utils/i18n";
import { convertStringToSvg, convertSvgFileToString, getMonochromeSvg } from "../utils/svg";

const LOGO_MAX_SIZE = (1024 * 1024) / 2; // 512KB

type Props = {
  logo: SVGElement | null;
  onChange: (logo: SVGElement) => void;
};

export const LogoUploadArea = ({ logo, onChange }: Props) => {
  const [error, setError] = useState(false);

  const handleLogoDrop = ([file]: File[]) => {
    if (file) {
      convertSvgFileToString(file)
        .then(convertStringToSvg)
        .then(svg => getMonochromeSvg(svg, "black"))
        .then(onChange)
        .then(() => {
          setError(false);
        })
        .catch(error => {
          console.error(error);
          setError(true);
        });
    } else {
      setError(true);
    }
  };

  return (
    <LakeLabel
      label={t("step.logo.label")}
      render={() => (
        <UploadArea
          accept={[".svg"]}
          error={error ? t("step.logo.error") : undefined}
          maxSize={LOGO_MAX_SIZE}
          onDropAccepted={handleLogoDrop}
          icon="arrow-download-filled"
          description={t("step.logo.description")}
          value={logo ?? undefined}
        />
      )}
    />
  );
};
