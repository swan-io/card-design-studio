import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  ConfigCard: "/",
  Share: "/share/:configName",
});

export const routeNames = ["ConfigCard", "Share"] as const;

export type RouteName = (typeof routeNames)[number];
