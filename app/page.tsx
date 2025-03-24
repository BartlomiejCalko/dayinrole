"use client";

import { useSession } from "next-auth/react";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";

export default function Home() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="flex flex-col">
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      {/* Add other sections here */}
    </div>
  );
}
