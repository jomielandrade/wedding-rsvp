import { z } from "zod";

export const rsvpSchema = z
  .object({
    inviteSlug: z
      .string()
      .trim()
      .min(1, "Invalid invitation link"),
    mobileNumber: z
      .string()
      .trim()
      .min(10, "Please enter a valid mobile number")
      .max(20, "Mobile number is too long")
      .regex(/^[\d+\s()-]+$/, "Please use numbers only"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    guestCount: z
      .number()
      .int()
      .min(1, "At least 1 guest")
      .max(10, "Maximum 10 guests"),
    companionNames: z.array(z.string()),
    attendance: z.enum(["attending", "declining"]),
    songRequest: z.string().trim().max(200, "Song request is too long").optional(),
    message: z.string().trim().max(500, "Message is too long").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.attendance !== "attending" || data.guestCount <= 1) return;

    const requiredCompanions = data.guestCount - 1;

    for (let index = 0; index < requiredCompanions; index += 1) {
      const name = data.companionNames[index]?.trim() ?? "";
      if (!name) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter your companion's full name",
          path: ["companionNames", index],
        });
        continue;
      }

      if (name.length > 100) {
        ctx.addIssue({
          code: "custom",
          message: "Name is too long",
          path: ["companionNames", index],
        });
      }
    }
  });

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export const rsvpDefaultValues: RsvpFormValues = {
  inviteSlug: "",
  mobileNumber: "",
  email: "",
  guestCount: 1,
  companionNames: [],
  attendance: "attending",
  songRequest: "",
  message: "",
};
