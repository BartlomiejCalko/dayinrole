"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLANS } from "@/lib/stripe";
import { Icons } from "@/components/shared/icons";

export function BillingForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (priceId: string, planName: string) => {
    try {
      setIsLoading(planName);
      
      // In a real app, this would redirect to Stripe checkout
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      name: "Pro",
      description: "Unlimited summaries and more features",
      priceId: PLANS.PRO.priceId || "price_pro",
      price: PLANS.PRO.price,
      features: [
        "Unlimited role summaries",
        "Enhanced summary details",
        "Export summaries as PDF",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      description: "For teams and organizations",
      priceId: PLANS.ENTERPRISE.priceId || "price_enterprise",
      price: PLANS.ENTERPRISE.price,
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Dedicated support",
      ],
    },
  ];

  return (
    <div className="grid gap-4">
      {plans.map((plan) => (
        <Card key={plan.name} className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-2 text-2xl font-bold">${plan.price.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            </div>
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Icons.chevronRight className="mr-2 h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout(plan.priceId, plan.name)}
              disabled={isLoading !== null}
              className="w-full"
            >
              {isLoading === plan.name ? (
                <>
                  <Icons.search className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                `Upgrade to ${plan.name}`
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 