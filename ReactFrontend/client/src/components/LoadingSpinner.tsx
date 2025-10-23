import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4" data-testid="loading-spinner">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-muted border-t-primary`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <p className="text-muted-foreground animate-pulse" data-testid="text-loading">
          {text}
        </p>
      )}
    </div>
  );
}
