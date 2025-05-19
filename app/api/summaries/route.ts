import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { getPlanData } from "@/lib/stripe";

const summaryRequestSchema = z.object({
  jobTitle: z.string().min(2),
  jobDescription: z.string().min(10),
});

// Mock AI generation function
async function generateDayInTheLifeSummary(jobTitle: string, jobDescription: string): Promise<string> {
  // In a real app, this would call an AI service like OpenAI
  return `# A Day in the Life of a ${jobTitle}

## Morning Routine (8:00 AM - 11:00 AM)
- Arrive at the office around 8:00 AM
- Check emails and messages from team members
- Attend daily standup meeting with the development team
- Review code PRs and provide feedback to team members
- Begin focused work on current sprint tasks

## Midday (11:00 AM - 2:00 PM)
- Collaborative work session with designers on upcoming features
- Lunch break, often with colleagues to discuss project challenges
- Weekly one-on-one with direct manager
- Address any urgent issues that have come up during the day

## Afternoon (2:00 PM - 5:30 PM)
- Deep work session on complex technical challenges
- Collaboration with backend developers to integrate APIs
- Mentoring junior team members when needed
- Documentation of completed work
- Planning for next day's priorities

## Key Responsibilities
- Developing and maintaining web applications
- Working closely with UX/UI designers to implement designs
- Code reviews and mentoring junior developers
- Participating in agile ceremonies
- Staying updated on latest front-end technologies

This role offers a good balance of independent work and team collaboration, with clear opportunities for growth and learning.`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const body = summaryRequestSchema.parse(json);

    // Default to free plan until Firebase implementation
    const plan = getPlanData("free");
    
    // Generate the summary (in a real app, this would call an AI service)
    const summary = await generateDayInTheLifeSummary(
      body.jobTitle,
      body.jobDescription
    );

    // Create mock summary response until Firebase implementation
    const roleSummary = {
      id: Math.random().toString(36).substring(2, 15),
      userId: session.user.id,
      jobTitle: body.jobTitle,
      jobDescription: body.jobDescription,
      summary,
      isPublic: false,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(roleSummary);
  } catch (error) {
    console.error("Error generating summary:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 