declare type CardColor = "silver" | "black"

declare type ConfigurationStep =
  | "intro"
  | "name"
  | "logo"
  | "color"
  | "completed"

declare type CameraPosition = ConfigurationStep

declare type Size = {
  width: number
  height: number
}

declare type LogoColor = "white" | "black"
