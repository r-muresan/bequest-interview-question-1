import { z } from "zod";

export const postDataRequestSchema = z.object({
  data: z.string(),
  checksum: z.string(),
});

export type PostDataRequest = z.infer<typeof postDataRequestSchema>;
