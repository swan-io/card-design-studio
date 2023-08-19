/// <reference types="vite/client" />

type ConfigStep = "welcome" | "name" | "logo" | "color" | "completed";

type CardConfig = {
  name: string;
  logo: SVGElement | null;
  logoScale: number;
  color: "Silver" | "Black";
};
