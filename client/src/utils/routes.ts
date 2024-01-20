import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  ConfigCard: "/",
  Share: "/share/:configId",
  Screenshot: "/screenshot/:configId",
  WebsiteDemo: "/website-demo?:backgroundColor&:cardColor&:cardHolderName",
});

export const routeNames = ["ConfigCard", "Share"] as const;

export type RouteName = (typeof routeNames)[number];
