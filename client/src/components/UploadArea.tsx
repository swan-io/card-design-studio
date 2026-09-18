import { AsyncData } from "@bloodyowl/boxed";
import { Icon, IconName } from "@swan-io/lake/src/components/Icon";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { LoadingView } from "@swan-io/lake/src/components/LoadingView";
import { Space } from "@swan-io/lake/src/components/Space";
import { commonStyles } from "@swan-io/lake/src/constants/commonStyles";
import {
  backgroundColor,
  colors,
  radii,
  shadows,
  spacings,
} from "@swan-io/lake/src/constants/design";
import { useBoolean } from "@swan-io/lake/src/hooks/useBoolean";
import { isNotNullish } from "@swan-io/lake/src/utils/nullish";
import { useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { StyleSheet, Text, View } from "react-native";
import { t } from "../utils/i18n";

// Derived from the former @swan-io/shared-business UploadArea, which lake 18 replaced by
// FilesUploader: that component drives an upload to the Swan API, whereas this app only
// needs a client-side drop area (the logo never leaves the browser until config creation).

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor.accented,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderStyle: "dashed",
    borderRadius: radii[8],
    padding: spacings[32],
    cursor: "pointer",
    alignItems: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  hoveredContainer: {
    boxShadow: shadows.tile,
  },
  activeContainer: {
    borderColor: colors.current[500],
    boxShadow: shadows.tile,
  },
  errorContainer: {
    borderColor: colors.negative[500],
  },
  browse: {
    color: colors.current[500],
  },
  browseBlock: {
    flex: 1,
  },
  decorativeIconLeft: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    opacity: 0,
    transform: "translateX(-50%) scale(0.6)",
    transitionProperty: "opacity, transform",
    transitionDuration: "300ms",
    transitionTimingFunction: "ease-in-out",
  },
  decorativeIconLeftHovered: {
    opacity: 0.3,
    transform: "translateX(-50%) translateX(-24px) scale(0.6) rotate(-5deg)",
  },
  decorativeIconRight: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    opacity: 0,
    transform: "translateX(-50%) scale(0.6)",
    transitionProperty: "opacity, transform",
    transitionDuration: "300ms",
    transitionTimingFunction: "ease-in-out",
  },
  decorativeIconRightHovered: {
    opacity: 0.3,
    transform: "translateX(-50%) translateX(24px) scale(0.6) rotate(5deg)",
  },
  preview: {
    aspectRatio: 16 / 5,
    width: "50%",
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  },
});

type Props = {
  icon: IconName;
  accept: string[];
  value?: AsyncData<File>;
  onDropAccepted?: DropzoneOptions["onDropAccepted"];
  onDropRejected?: DropzoneOptions["onDropRejected"];
  description?: string;
  error?: string;
  maxSize?: number;
};

const UploadAreaPreview = ({ file }: { file: File }) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  return <View style={[styles.preview, { backgroundImage: `url("${url}")` }]} />;
};

export const UploadArea = ({
  icon,
  accept,
  value,
  onDropAccepted,
  onDropRejected,
  description,
  error,
  maxSize,
}: Props) => {
  const [isHovered, setIsHovered] = useBoolean(false);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: accept.reduce((acc, item) => ({ ...acc, [item]: [] }), {}),
    onDropAccepted,
    onDropRejected,
    maxSize,
  });

  const browseElement = (
    <>
      <View style={styles.icon}>
        <Icon
          name={icon}
          size={48}
          color={colors.current[500]}
          style={[
            styles.decorativeIconLeft,
            (isDragActive || isHovered) && styles.decorativeIconLeftHovered,
          ]}
        />

        <Icon
          name={icon}
          size={48}
          color={colors.current[500]}
          style={[
            styles.decorativeIconRight,
            (isDragActive || isHovered) && styles.decorativeIconRightHovered,
          ]}
        />

        <Icon name={icon} size={48} color={colors.current[500]} />
      </View>

      <Space height={16} />

      <View style={styles.browseBlock}>
        <LakeHeading level={5} variant="h5" align="center">
          {t("uploadArea.dropFile")}

          <Text style={styles.browse}>{t("uploadArea.browse")}</Text>
        </LakeHeading>

        {isNotNullish(error) ? (
          <>
            <Space height={4} />

            <LakeText color={colors.negative[400]} align="center">
              {error}
            </LakeText>
          </>
        ) : (
          isNotNullish(description) && (
            <>
              <Space height={4} />
              <LakeText align="center">{description}</LakeText>
            </>
          )
        )}
      </View>
    </>
  );

  return (
    <View style={commonStyles.fill}>
      <div {...getRootProps()} onMouseEnter={setIsHovered.on} onMouseLeave={setIsHovered.off}>
        <View
          aria-errormessage={error ?? fileRejections[0]?.errors.join(", ")}
          style={[
            styles.container,
            !isDragActive && isHovered && styles.hoveredContainer,
            isDragActive && styles.activeContainer,
            (isNotNullish(error) || fileRejections.length > 0) && styles.errorContainer,
          ]}
        >
          <input {...getInputProps()} />

          {isNotNullish(value)
            ? value.match({
                NotAsked: () => browseElement,
                Loading: () => <LoadingView />,
                Done: file => <UploadAreaPreview file={file} />,
              })
            : browseElement}
        </View>
      </div>
    </View>
  );
};
