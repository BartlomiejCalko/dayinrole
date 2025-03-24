import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getPlanData } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingForm } from "@/components/billing/billing-form";
import { Icons } from "@/components/shared/icons";

export default async function BillingPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const plan = getPlanData(user.subscriptionStatus);
  const usageCount = user.usageCount || 0;
  const usageLimit = plan.limit;
  const usagePercentage = usageLimit === Infinity ? 0 : (usageCount / usageLimit) * 100;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Current Plan</CardTitle>
            <CardDescription>
              Manage your subscription and billing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{plan.name} Plan</h3>
              <p className="text-muted-foreground">
                {plan.price === 0
                  ? "Free plan with limited usage"
                  : `$${plan.price}/month`}
              </p>
            </div>

            {plan.limit !== Infinity && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Usage ({usageCount}/{usageLimit})</span>
                  <span>{Math.min(100, Math.round(usagePercentage))}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.min(100, Math.round(usagePercentage))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {user.stripeCustomerId && (
              <div className="mt-6 grid gap-2">
                <div className="rounded-md bg-primary/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icons.billing className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Subscription Active</h3>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            {plan.name === "Free" ? (
              <Button asChild className="w-full">
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            ) : (
              <>
                <form action="/api/create-portal-link" method="POST" className="w-full">
                  <Button className="w-full" type="submit" variant="outline">
                    Manage Subscription in Stripe
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Manage your subscription, payment methods, and billing details through Stripe.
                </p>
              </>
            )}
          </CardFooter>
        </Card>

        {plan.name === "Free" && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Get unlimited summaries and more features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 