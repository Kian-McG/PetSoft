import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(15),
    ownerName: z.string().trim().min(1, "Owner name is required").max(15),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Image must be a valid url" }),
    ]),
    age: z.coerce
      .number()
      .int()
      .positive("Age must be a positive number")
      .max(300, "Age must be less than 300"),
    notes: z.union([
      z.literal(""),
      z.string().trim().max(500, "Notes must be less than 500 characters"),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export type PetFormValues = z.infer<typeof petFormSchema>;

export const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
export type AuthFormValues = z.infer<typeof authFormSchema>;
