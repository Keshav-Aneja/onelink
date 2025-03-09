import { z } from "zod";

export const urlSchema = z.string().url();
export type urlType = z.infer<typeof urlSchema>;
