/// <reference types="vite/client" />

type ConfigStep =
  | "welcome"
  | "name"
  | "logo"
  | "color"
  | "completed"
  | "share"
  | "screenshot"
  | "website-demo";

type CardConfig = {
  name: string;
  logo: SVGElement | HTMLImageElement | null;
  logoScale: number;
  color: "Silver" | "Black" | "Custom";
};

type CreateConfigResponse = {
  id: string;
  screenshotUrl: string | null;
  shareUrl: string;
};

type Size = {
  width: number;
  height: number;
};
