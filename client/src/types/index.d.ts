/// <reference types="vite/client" />

type ConfigStep = "welcome" | "name" | "logo" | "color" | "completed" | "share";

type CardConfig = {
  name: string;
  logo: SVGElement | null;
  logoScale: number;
  color: "Silver" | "Black";
};

type Size = {
  width: number;
  height: number;
};
