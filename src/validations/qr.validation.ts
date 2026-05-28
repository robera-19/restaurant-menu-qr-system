import { z } from "zod";

export const createQrSchema = z.object({
  body: z.object({
    name: z.string().min(1, "QR Name is required (e.g. Table 5)"),
  }),
});
