import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    limit: 3,
    price: 0,
  },
  PRO: {
    name: "Pro",
    limit: Infinity,
    price: 9.99,
    priceId: "", // Add your Stripe price ID here
  },
  ENTERPRISE: {
    name: "Enterprise",
    limit: Infinity,
    price: 29.99,
    priceId: "", // Add your Stripe price ID here
  },
};

export interface PlanData {
  name: string;
  limit: number;
  price: number;
  priceId?: string;
}

export function getPlanData(planName: string): PlanData {
  switch (planName.toLowerCase()) {
    case "pro":
      return PLANS.PRO;
    case "enterprise":
      return PLANS.ENTERPRISE;
    default:
      return PLANS.FREE;
  }
} 