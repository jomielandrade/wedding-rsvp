import { z } from "zod";

export const guestSlugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(80, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only",
  );

export const guestFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name is too long"),
  slug: guestSlugSchema,
  maxGuests: z.number().int().min(1).max(20),
});

export type GuestFormValues = z.infer<typeof guestFormSchema>;
