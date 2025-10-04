import { Loader2, Music } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Analyzing emotions..." }: LoadingStateProps) {
  return (
    <Card className="p-12 flex flex-col items-center justify-center gap-6" data-testid="card-loading">
      <div className="relative">
        <Music className="w-16 h-16 text-primary" />
        <Loader2 className="w-16 h-16 text-primary animate-spin absolute inset-0" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground" data-testid="text-loading-message">
          {message}
        </h3>
        <p className="text-sm text-muted-foreground">
          This may take a few moments
        </p>
      </div>
    </Card>
  );
}
