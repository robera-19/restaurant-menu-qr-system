import { z } from "zod";

export const createRatingSchema = z.object({
  body: z.object({
    menuItemId: z.string().uuid("Invalid menu item"),
    ratingValue: z
      .number()
      .int()
      .min(1)
      .max(5, "Rating must be between 1 and 5"),
    customerName: z.string().max(100).optional().nullable(),
    comment: z.string().max(500).optional().nullable(),
    qrCodeId: z.string().uuid().optional().nullable(), // To track the table
  }),
});
