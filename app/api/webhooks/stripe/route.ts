import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Payment was successful
      if (session.metadata?.userId) {
        const userId = session.metadata.userId;
        const customerId = session.customer as string;
        
        // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        
        // Based on the Price ID, determine which plan the user is subscribed to
        const priceId = subscription.items.data[0].price.id;
        let subscriptionStatus = "free";
        
        // In a real app, we'd match this to our PLANS.PRO.priceId, etc.
        if (priceId.includes("pro")) {
          subscriptionStatus = "pro";
        } else if (priceId.includes("enterprise")) {
          subscriptionStatus = "enterprise";
        }
        
        // Update the user with subscription information
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            stripeCustomerId: customerId,
            subscriptionStatus,
          },
        });
      }
      break;
      
    case "invoice.payment_succeeded":
      // Subscription was renewed or changed
      // In a real app, we'd update the subscription status similar to above
      break;
      
    case "customer.subscription.deleted":
      // Subscription was canceled
      // We'd update the subscription status to free
      // and fetch the customer ID to find the user
      break;
  }

  return NextResponse.json({ received: true });
} 