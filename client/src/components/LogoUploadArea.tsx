import { AsyncData } from "@swan-io/boxed";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
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

const LOGO_MAX_SIZE = (1024 * 1024) / 2; // 512KB

type Props = {
  logo: SVGElement | HTMLImageElement | null;
  onChange: (logo: SVGElement | HTMLImageElement) => void;
};

export const LogoUploadArea = ({ onChange }: Props) => {
  const [file, setFile] = useState<AsyncData<File>>(AsyncData.NotAsked());
  const [error, setError] = useState<string>();

  const handleLogoDrop = ([file]: File[]) => {
    setFile(AsyncData.Loading());
    match(file)
      .with({ type: "image/svg+xml" }, file => {
        convertSvgFileToString(file)
          .then(convertStringToSvg)
          .then(svg => getMonochromeSvg(svg, "black"))
          .then(onChange)
          .then(() => {
            setError(undefined);
            setFile(AsyncData.Done(file));
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
            onChange(image);
            setFile(AsyncData.Done(file));
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
          value={file}
        />
      )}
    />
  );
};
