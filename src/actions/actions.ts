"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { authFormSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ----- User Actions -----

export const logIn = async (prevState: unknown, formData: unknown) => {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { message: "Invalid credentials" };
        }
        default: {
          return {
            message: "Could not sign in",
          };
        }
      }
    }
    throw error; // rethrow the error if it's not an AuthError
  }
  // await signIn("credentials", formData);
};

export const logOut = async () => {
  await signOut({
    redirectTo: "/",
  });
};

export const signUp = async (prevState: unknown, formData: unknown) => {
  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }
  // convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  // validation
  const validatedFormData = authFormSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return { message: "Invalid form data" };
  }
  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { message: "Email already exists" };
      }
      if (e.code === "P2003") {
        return { message: "Failed to create user" };
      }
    }
  }
  await signIn("credentials", formData);
};

// ----- Pet Actions -----
type AddPetResponse = {
  message?: string;
};

export const addPet = async (pet: unknown): Promise<AddPetResponse | void> => {
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (e) {
    return {
      message: "Failed to add pet",
    };
  }
  revalidatePath("/app", "layout");
};

export const editPet = async (
  id: unknown,
  newPetData: unknown
): Promise<{ message?: string } | void> => {
  //authenticating user
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(id);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  //authorization check (user owns the pet)
  const petOwnerId = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
    select: {
      userId: true,
    },
  });
  if (!petOwnerId) {
    return {
      message: "Pet not found",
    };
  }
  if (petOwnerId.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  //database operation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (e) {
    return {
      message: "Failed to edit pet",
    };
  }

  revalidatePath("/app", "layout");
};

export const deletePet = async (id: unknown) => {
  //authenticating user
  const session = await checkAuth();

  //validating pet id
  const validatedPetId = petIdSchema.safeParse(id);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id",
    };
  }
  //authorization check (user owns the pet)
  const petOwnerId = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
    select: {
      userId: true,
    },
  });
  if (!petOwnerId) {
    return {
      message: "Pet not found",
    };
  }
  if (petOwnerId.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  // database operation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (e) {
    return {
      message: "Failed to delete pet",
    };
  }

  revalidatePath("/app", "layout");
};

// ----- Payment Actions -----

export const CreateCheckoutSession = async () => {
  const session = await checkAuth();
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1QKpWQLOnPo0NndkPwseoBgB",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/payment?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment?cancelled=false`,
  });
  // redirect to stripe checkout
  redirect(checkoutSession.url);
};
