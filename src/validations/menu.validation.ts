import { z } from "zod";

export const createMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().uuid("Category is required"),
    price: z.number().positive("Price must be a positive number"),
    // Optional fields must use .nullable().optional()
    oldPrice: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
    preparationTime: z.number().int().nullable().optional(),
    spicyLevel: z.number().int().min(0).max(3).default(0),
    isFeatured: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    ingredients: z.array(z.string()).default([]),
    allergens: z.array(z.string()).default([]),
    calories: z.number().int().nullable().optional(),
    protein: z.string().nullable().optional(),
    carbs: z.string().nullable().optional(),
    fat: z.string().nullable().optional(),
    images: z
      .array(
        z.object({
          imageUrl: z.string().url(),
          isPrimary: z.boolean(),
        }),
      )
      .optional(),
  }),
});

export const updateMenuItemSchema = z.object({
  body: createMenuItemSchema.shape.body.partial(),
});

export const toggleSchema = z.object({
  body: z.object({ isAvailable: z.boolean() }),
});
