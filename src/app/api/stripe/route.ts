import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (request: Request) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  // verify webhook came from stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(err);
    return Response.json(null, { status: 400 });
  }

  //fulfill order
  switch (event.type) {
    case "checkout.session.completed":
      await prisma.user.update({
        where: {
          email: event.data.object.customer_email,
        },
        data: {
          hasAccess: true,
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return Response.json(null, { status: 200 });
};
