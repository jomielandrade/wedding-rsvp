import { z } from "zod";

export const rsvpSchema = z.object({
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
  attendance: z.enum(["attending", "declining"]),
  songRequest: z.string().trim().max(200, "Song request is too long").optional(),
  message: z.string().trim().max(500, "Message is too long").optional(),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export const rsvpDefaultValues: RsvpFormValues = {
  inviteSlug: "",
  mobileNumber: "",
  email: "",
  guestCount: 1,
  attendance: "attending",
  songRequest: "",
  message: "",
};
