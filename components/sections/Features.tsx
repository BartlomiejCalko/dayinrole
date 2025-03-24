import { motion } from "framer-motion";
import { Icons } from "@/components/shared/icons";

export function Features() {
  return (
    <section className="w-full py-24 bg-muted/50">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Features
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover what makes dayinrole the best way to understand job roles
            </p>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<Icons.brain />}
            title="AI-Powered Insights"
            description="Our AI analyzes job descriptions to create accurate daily routine scenarios."
            delay={0.1}
          />
          <FeatureCard
            icon={<Icons.infinity />}
            title="Unlimited Summaries"
            description="Pro subscribers can generate as many day-in-the-life scenarios as needed."
            delay={0.2}
          />
          <FeatureCard
            icon={<Icons.user />}
            title="Career Insights"
            description="Make informed career decisions with realistic job role expectations."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="p-2 rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {description}
      </p>
    </motion.div>
  );
} 