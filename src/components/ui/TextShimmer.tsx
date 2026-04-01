import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function TextShimmer({
  children,
  className,
  duration = 1.2,
}: TextShimmerProps) {
  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{
        WebkitTextFillColor: "transparent",
        background:
          "linear-gradient(to right, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.25) 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundRepeat: "no-repeat",
        backgroundSize: "50% 100%",
      } as React.CSSProperties}
      initial={{ backgroundPositionX: "200%" }}
      animate={{ backgroundPositionX: ["-100%", "200%"] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}

export default TextShimmer;
