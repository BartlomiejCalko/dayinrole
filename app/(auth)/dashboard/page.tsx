import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { getPlanData } from "@/lib/stripe";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Temporary empty array until Firebase implementation
  const roleSummaries = [];

  // Default values until Firebase implementation
  const plan = getPlanData("free");
  const usageCount = 0;
  const usageLimit = plan.limit;
  const canGenerate = usageCount < usageLimit || usageLimit === Infinity;

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild disabled={!canGenerate}>
          <Link href="/dashboard/new">
            <Icons.add className="h-4 w-4 mr-2" />
            Generate New
          </Link>
        </Button>
      </div>

      {!canGenerate && (
        <Card className="mb-8 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Icons.billing className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">You've reached your usage limit</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to a paid plan to generate more role summaries
                </p>
              </div>
              <Button asChild className="ml-auto" size="sm">
                <Link href="/billing">Upgrade Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {roleSummaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Icons.files className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No role summaries yet</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Generate your first day-in-the-life summary by pasting a job description.
            </p>
            <Button asChild disabled={!canGenerate}>
              <Link href="/dashboard/new">
                <Icons.add className="h-4 w-4 mr-2" />
                Generate New
              </Link>
            </Button>
          </div>
        ) :
          roleSummaries.map((summary) => (
            <Card key={summary.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{summary.jobTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(summary.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  {summary.summary.substring(0, 200)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/${summary.id}`}>
                    View Full Summary
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Icons.edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Icons.trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 