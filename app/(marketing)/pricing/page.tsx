"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import { Icons } from "@/components/shared/icons";

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const pricingData = [
    {
      title: "Free",
      description: "For individuals just trying it out",
      price: "$0",
      interval: "",
      features: [
        "3 role summaries per account",
        "Basic day-in-the-life summary",
        "Save and access your summaries",
      ],
      priceId: "",
      planType: "free",
    },
    {
      title: "Pro",
      description: "For serious job seekers",
      price: billingInterval === "monthly" ? "$9.99" : "$99.9",
      interval: billingInterval === "monthly" ? "/month" : "/year",
      features: [
        "Unlimited role summaries",
        "Enhanced summary details",
        "Export summaries as PDF",
        "Compare multiple roles",
        "Priority support",
      ],
      priceId: PLANS.PRO.priceId,
      planType: "pro",
      most_popular: true,
    },
    {
      title: "Enterprise",
      description: "For teams and organizations",
      price: billingInterval === "monthly" ? "$29.99" : "$299.9",
      interval: billingInterval === "monthly" ? "/month" : "/year",
      features: [
        "Everything in Pro plan",
        "Team collaboration",
        "Admin dashboard",
        "API access",
        "Custom integration",
        "Dedicated support",
      ],
      priceId: PLANS.ENTERPRISE.priceId,
      planType: "enterprise",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8 mb-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-xl max-w-[700px] mx-auto">
            Choose the plan that's right for you and start understanding job roles better today.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant={billingInterval === "monthly" ? "default" : "outline"}
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingInterval === "yearly" ? "default" : "outline"}
            onClick={() => setBillingInterval("yearly")}
          >
            Yearly
            <span className="ml-1.5 rounded-full bg-primary-foreground px-2 py-0.5 text-xs text-primary">
              Save 15%
            </span>
          </Button>
        </div>
      </div>

      <motion.div
        className="grid gap-8 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pricingData.map((plan) => (
          <motion.div key={plan.title} variants={itemVariants}>
            <Card className={plan.most_popular ? "border-primary shadow-lg" : ""}>
              {plan.most_popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  {plan.price}
                  <span className="ml-1 text-xl font-medium text-muted-foreground">
                    {plan.interval}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Icons.chevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.most_popular ? "default" : "outline"}
                >
                  <Link
                    href={
                      isAuthenticated
                        ? plan.planType === "free"
                          ? "/dashboard"
                          : "/billing"
                        : "/login"
                    }
                  >
                    {isAuthenticated
                      ? plan.planType === "free"
                        ? "Current Plan"
                        : session?.user.subscriptionStatus === plan.planType
                        ? "Current Plan"
                        : "Upgrade"
                      : "Get Started"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-20 mx-auto max-w-3xl rounded-lg border bg-card p-8">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">What happens when I reach my usage limit?</h4>
            <p className="text-muted-foreground">
              On the Free plan, you'll be prompted to upgrade once you've used all 3 summaries. Your existing summaries will remain accessible.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Can I cancel my subscription?</h4>
            <p className="text-muted-foreground">
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">How accurate are the day-in-the-life summaries?</h4>
            <p className="text-muted-foreground">
              Our AI analyzes thousands of job descriptions to create accurate summaries. While they provide valuable insights, actual job experiences may vary by company and team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 