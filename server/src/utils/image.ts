import { BusboyFileStream } from "@fastify/busboy";
import { Result } from "@swan-io/boxed";
import { match } from "ts-pattern";

export const stringifyImage = async (
  file: BusboyFileStream,
  mimetype: string,
): Promise<Result<string, unknown>> => {
  if (mimetype !== "image/svg+xml" && mimetype !== "image/png") {
    return Result.Error(new Error(`Invalid mimetype: ${mimetype}`));
  }

  try {
    const chunks: Buffer[] = [];

    for await (const chunk of file) {
      chunks.push(chunk); // eslint-disable-line @typescript-eslint/no-unsafe-argument
    }

    const buffer = Buffer.concat(chunks);
    const string = match(mimetype)
      .with("image/svg+xml", () => buffer.toString())
      .with("image/png", () => `data:image/png;base64,${buffer.toString("base64url")}`)
      .exhaustive();

    return Result.Ok(string);
  } catch (error) {
    return Result.Error(error);
  }
};
