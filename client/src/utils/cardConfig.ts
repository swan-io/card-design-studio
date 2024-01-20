import { AsyncData, Result } from "@swan-io/boxed";
import { useEffect, useState } from "react";
import { P, match } from "ts-pattern";
import { Except } from "type-fest";
import { convertStringToSvg } from "./svg";

type ConfigApiResponse = Except<CardConfig, "logo"> & {
  logo: string;
};

export const useCardConfig = (
  configId: string,
  onLoaded: (config: CardConfig) => void,
): AsyncData<Result<CardConfig, unknown>> => {
  const [state, setState] = useState<AsyncData<Result<CardConfig, unknown>>>(AsyncData.NotAsked());

  useEffect(() => {
    setState(AsyncData.Loading());

    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(`/api/config/${configId}`, { signal })
      .then(async response => {
        if (!response.ok) {
          return { ok: false };
        }

        const data: ConfigApiResponse = await response.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

        const logo = match(data.logo)
          .with(P.string.startsWith("<svg"), svg => convertStringToSvg(svg))
          .otherwise(base64Uri => {
            // if logo does not start with <svg, it is a base64 encoded png
            const image = new Image();
            image.src = base64Uri;
            return image;
          });

        return {
          ok: true,
          data: {
            ...data,
            logo,
          },
        };
      })
      .then(result => {
        match(result)
          .with({ data: P.not(P.nullish) }, ({ data }) => {
            setState(AsyncData.Done(Result.Ok(data)));
            // "/api/config/:id" returns a CardConfig if request is successful
            onLoaded(data);
          })
          .otherwise(() => {
            setState(AsyncData.Done(Result.Error(undefined)));
          });
      })
      .catch(error => {
        console.error(error);
        setState(AsyncData.Done(Result.Error(undefined)));
      });

    return () => {
      abortController.abort();
    };
  }, [configId, onLoaded]);

  return state;
};
