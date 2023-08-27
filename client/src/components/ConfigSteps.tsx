import { AsyncData, Option, Result } from "@swan-io/boxed";
import { Box } from "@swan-io/lake/src/components/Box";
import { Fill } from "@swan-io/lake/src/components/Fill";
import { LakeButton } from "@swan-io/lake/src/components/LakeButton";
import { LakeHeading } from "@swan-io/lake/src/components/LakeHeading";
import { LakeLabel } from "@swan-io/lake/src/components/LakeLabel";
import { LakeModal } from "@swan-io/lake/src/components/LakeModal";
import { LakeText } from "@swan-io/lake/src/components/LakeText";
import { LakeTextInput } from "@swan-io/lake/src/components/LakeTextInput";
import { Link } from "@swan-io/lake/src/components/Link";
import { RadioGroup, RadioGroupItem } from "@swan-io/lake/src/components/RadioGroup";
import { Slider } from "@swan-io/lake/src/components/Slider";
import { Space } from "@swan-io/lake/src/components/Space";
import { SwanLogo } from "@swan-io/lake/src/components/SwanLogo";
import { Tile } from "@swan-io/lake/src/components/Tile";
import { TransitionView } from "@swan-io/lake/src/components/TransitionView";
import { animations, colors } from "@swan-io/lake/src/constants/design";
import { useResponsive } from "@swan-io/lake/src/hooks/useResponsive";
import { isNullish } from "@swan-io/lake/src/utils/nullish";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { P, isMatching, match } from "ts-pattern";
import { t } from "../utils/i18n";
import { createSwanLogoSvg } from "../utils/svg";
import { ConfigRightPanel } from "./ConfigRightPanel";
import { ShareModal } from "./ShareModal";
import { SvgUploadArea } from "./SvgUploadArea";

const styles = StyleSheet.create({
  welcomeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray[0],
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeStep: {
    flex: 1,
    maxWidth: 700,
    paddingHorizontal: 24,
  },
  welcomeSwanLogo: {
    width: 98,
    height: 22,
  },
  startButton: {
    alignSelf: "flex-start",
  },
  stepContainerMobile: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  stepContainerDesktop: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    width: 512,
    margin: "auto",
  },
  tileMobile: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 0,
  },
  tileDesktop: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  nameNextButton: {
    alignSelf: "flex-end",
  },
  editButtonContainer: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    maxWidth: 512,
    margin: "auto",
  },
  grow: {
    flex: 1,
  },
});

type StepTileProps = {
  visible: boolean;
  children: React.ReactNode;
};

const StepTile = ({ visible, children }: StepTileProps) => {
  const { media } = useResponsive(600);

  return (
    <TransitionView
      style={media({ mobile: styles.stepContainerMobile, desktop: styles.stepContainerDesktop })}
      {...animations.fadeAndSlideInFromTop}
    >
      {visible ? (
        <Tile style={media({ mobile: styles.tileMobile, desktop: styles.tileDesktop })}>
          {children}
        </Tile>
      ) : null}
    </TransitionView>
  );
};

type WelcomeStepProps = {
  visible: boolean;
  onStart: () => void;
};

export const WelcomeStep = ({ visible, onStart }: WelcomeStepProps) => (
  <TransitionView style={styles.welcomeContainer} {...animations.fadeAndSlideInFromTop}>
    {visible ? (
      <View style={styles.welcomeStep}>
        <Space height={24} />

        <Box alignItems="center">
          <SwanLogo style={styles.welcomeSwanLogo} />
        </Box>

        <Fill minHeight={24} />

        <Box direction="row" alignItems="center">
          <LakeHeading level={1} variant="h1">
            {t("welcome.title")}
          </LakeHeading>
        </Box>

        <Space height={16} />

        <LakeHeading level={2} variant="h3" color={colors.gray[600]}>
          {t("welcome.subtitle")}
        </LakeHeading>

        <Space height={32} />

        <LakeButton
          color="live"
          icon="arrow-right-filled"
          iconPosition="end"
          style={styles.startButton}
          onPress={onStart}
        >
          {t("welcome.button")}
        </LakeButton>

        <Fill minHeight={32} />
      </View>
    ) : null}
  </TransitionView>
);

type NameStepProps = {
  visible: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
};

export const NameStep = ({ visible, name, onNameChange, onNext }: NameStepProps) => (
  <StepTile visible={visible}>
    <LakeLabel
      label={t("step.name.label")}
      render={id => (
        <LakeTextInput
          id={id}
          value={name}
          placeholder="Roland Moreno"
          onChangeText={onNameChange}
        />
      )}
    />

    <LakeButton
      icon="arrow-right-filled"
      iconPosition="end"
      color="live"
      size="small"
      style={styles.nameNextButton}
      onPress={onNext}
    >
      {t("common.nextStep")}
    </LakeButton>
  </StepTile>
);

type LogoStepProps = {
  visible: boolean;
  logo: SVGElement | null;
  logoScale: number;
  onLogoChange: (logo: SVGElement) => void;
  onLogoScaleChange: (logoScale: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const DEFAULT_LOGO_ZOOM = 0.6;

export const LogoStep = ({
  visible,
  logo,
  logoScale,
  onLogoChange,
  onLogoScaleChange,
  onPrevious,
  onNext,
}: LogoStepProps) => {
  return (
    <StepTile visible={visible}>
      <SvgUploadArea logo={logo} onChange={onLogoChange} />
      <Space height={24} />

      <LakeLabel
        label={t("step.logo.size.label")}
        render={() => (
          <Slider
            disabled={isNullish(logo)}
            minimum={0}
            maximum={1}
            step={0.01}
            value={logoScale}
            onValueChange={onLogoScaleChange}
          />
        )}
      />

      <Space height={24} />

      <Box direction="row" alignItems="center">
        <LakeButton
          ariaLabel={t("common.previousStep")}
          mode="secondary"
          icon="chevron-left-filled"
          color="live"
          size="small"
          onPress={onPrevious}
        />

        <Fill minWidth={8} />

        {isNullish(logo) ? (
          <LakeButton
            mode="secondary"
            color="live"
            size="small"
            onPress={() => {
              const swanLogo = createSwanLogoSvg();
              onLogoChange(swanLogo);
              onLogoScaleChange(DEFAULT_LOGO_ZOOM);
            }}
          >
            {t("step.logo.setSwanLogo")}
          </LakeButton>
        ) : null}

        <Space width={16} />

        <LakeButton
          icon="arrow-right-filled"
          iconPosition="end"
          color="live"
          size="small"
          disabled={isNullish(logo)}
          onPress={onNext}
        >
          {t("common.nextStep")}
        </LakeButton>
      </Box>
    </StepTile>
  );
};

type ColorStepProps = {
  visible: boolean;
  color: "Silver" | "Black";
  onColorChange: (color: "Silver" | "Black") => void;
  onPrevious: () => void;
  onNext: () => void;
};

const colorItems: RadioGroupItem<CardConfig["color"] | "Custom">[] = [
  {
    name: t("step.color.silver"),
    value: "Silver",
  },
  {
    name: t("step.color.black"),
    value: "Black",
  },
  {
    name: t("step.color.custom"),
    value: "Custom",
  },
];

const CONTACT_EMAIL = "hello@swan.io";

export const ColorStep = ({
  visible,
  color,
  onColorChange,
  onPrevious,
  onNext,
}: ColorStepProps) => {
  const [customColorModalOpened, setCustomColorModalOpened] = useState(false);

  const handleColorChange = (color: CardConfig["color"] | "Custom") => {
    match(color)
      .with("Custom", () => setCustomColorModalOpened(true))
      .otherwise(color => onColorChange(color));
  };

  return (
    <>
      <StepTile visible={visible}>
        <LakeLabel
          type="radioGroup"
          label={t("step.color.label")}
          render={() => (
            <RadioGroup value={color} items={colorItems} onValueChange={handleColorChange} />
          )}
        />

        <Space height={24} />

        <Box direction="row" alignItems="center">
          <LakeButton
            ariaLabel={t("common.previousStep")}
            mode="secondary"
            icon="chevron-left-filled"
            color="live"
            size="small"
            onPress={onPrevious}
          />

          <Fill minWidth={8} />

          <LakeButton
            icon="arrow-right-filled"
            iconPosition="end"
            color="live"
            size="small"
            onPress={onNext}
          >
            {t("common.confirm")}
          </LakeButton>
        </Box>
      </StepTile>

      <LakeModal
        visible={customColorModalOpened}
        title={t("step.color.customModalTitle")}
        onPressClose={() => setCustomColorModalOpened(false)}
      >
        <LakeText>
          {t("step.color.customModalDescription")}

          <Space width={4} />

          <Link to={`mailto:${CONTACT_EMAIL}`} target="_blank">
            <LakeText color={colors.live[500]}>{CONTACT_EMAIL}</LakeText>
          </Link>
        </LakeText>

        <Space height={4} />
        <LakeText>{t("step.color.customModalDelay")}</LakeText>
      </LakeModal>
    </>
  );
};

type CompletedStepProps = {
  visible: boolean;
  ownerName: string;
  color: CardConfig["color"];
  logo: SVGElement | null;
  logoScale: number;
  onOwnerNameChange: (ownerName: string) => void;
  onColorChange: (color: CardConfig["color"]) => void;
  onLogoChange: (logo: SVGElement) => void;
  onLogoScaleChange: (logoScale: number) => void;
};

export const CompletedStep = ({
  visible,
  ownerName,
  color,
  logo,
  logoScale,
  onOwnerNameChange,
  onColorChange,
  onLogoChange,
  onLogoScaleChange,
}: CompletedStepProps) => {
  const [editing, setEditing] = useState(false);
  const [shareState, setShareState] = useState<AsyncData<Result<{ configId: string }, unknown>>>(
    AsyncData.NotAsked(),
  );
  const [shareModalClosed, setShareModalClosed] = useState(false);

  const configId = match(shareState)
    .with(AsyncData.P.Done(Result.P.Ok(P.select())), ({ configId }) => Option.Some(configId))
    .otherwise(() => Option.None());

  const shareConfig = () => {
    // if config is already uploaded, just show the link without uploading again
    if (configId.isSome()) {
      setShareModalClosed(false);
      return;
    }

    setShareState(AsyncData.Loading());

    fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: ownerName,
        color,
        logo: logo?.outerHTML,
        logoScale,
      }),
    })
      .then(async response => {
        const data = await response.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

        if (isMatching({ configId: P.string }, data)) {
          setShareState(AsyncData.Done(Result.Ok(data)));
        } else {
          setShareState(AsyncData.Done(Result.Error(data)));
        }
      })
      .catch(error => {
        setShareState(AsyncData.Done(Result.Error(error)));
      });
  };

  return (
    <>
      <TransitionView style={styles.editButtonContainer} {...animations.fadeAndSlideInFromTop}>
        {visible ? (
          <Box direction="row">
            <LakeButton
              color="live"
              mode="secondary"
              icon="edit-regular"
              disabled={shareState.isLoading()}
              style={styles.grow}
              onPress={() => setEditing(true)}
            >
              {t("step.completed.edit")}
            </LakeButton>

            <Space width={16} />

            <LakeButton
              color="live"
              icon="arrow-upload-filled"
              style={styles.grow}
              loading={shareState.isLoading()}
              onPress={shareConfig}
            >
              {t("step.completed.share")}
            </LakeButton>
          </Box>
        ) : null}
      </TransitionView>

      <ShareModal
        visible={!shareModalClosed && configId.isSome()}
        configId={configId.getWithDefault("")}
        onPressClose={() => setShareModalClosed(true)}
      />

      <ConfigRightPanel
        visible={editing}
        ownerName={ownerName}
        color={color}
        logo={logo}
        logoScale={logoScale}
        onOwnerNameChange={onOwnerNameChange}
        onColorChange={onColorChange}
        onLogoChange={onLogoChange}
        onLogoScaleChange={onLogoScaleChange}
        onClose={() => setEditing(false)}
      />
    </>
  );
};
