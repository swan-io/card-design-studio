/// <reference types="vite/client" />

type ConfigStep = "welcome" | "name" | "logo" | "color" | "completed" | "share";

type CardConfig = {
  name: string;
  logo: SVGElement | HTMLImageElement | null;
  logoScale: number;
  color: "Silver" | "Black";
};

type Size = {
  width: number;
  height: number;
};
