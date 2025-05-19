import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

export default async function SummaryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Mock data until Firebase implementation
  const summary = {
    id: params.id,
    jobTitle: "Example Job Title",
    createdAt: new Date().toISOString(),
    summary: "# A Day in the Life\n\n## Morning\n- Task 1\n- Task 2\n\n## Afternoon\n- Task 3\n- Task 4",
    jobDescription: "This is a placeholder job description until Firebase is implemented."
  };

  if (!summary) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <Icons.chevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-2xl">{summary.jobTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generated on {format(new Date(summary.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {summary.summary.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mb-4 mt-6">{line.substring(2)}</h1>
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mb-3 mt-6">{line.substring(3)}</h2>
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="my-1">{line.substring(2)}</li>
                } else if (line === '') {
                  return <div key={index} className="my-4"></div>
                } else {
                  return <p key={index} className="my-4">{line}</p>
                }
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Icons.edit className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="outline">
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              The original job description used to generate this summary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto rounded-md bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{summary.jobDescription}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 