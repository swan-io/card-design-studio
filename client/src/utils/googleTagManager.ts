import TagManager from "react-gtm-module";

let dataLayer: unknown[] | undefined = undefined;

export const initializeGoogleTagManager = () => {
  TagManager.initialize({
    gtmId: __env.CLIENT_GOOGLE_TAG_MANAGER_ID,
    dataLayer: { event: "click", name: "test" },
  });
  // @ts-expect-error - dataLayer is defined by react-gtm-module after initialization
  dataLayer = window.dataLayer; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
};

export const trackClickEvent = (name: string) => {
  dataLayer?.push({
    event: "click",
    name,
  });
};
