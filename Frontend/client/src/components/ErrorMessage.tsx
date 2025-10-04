import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Card className="p-8 border-destructive/20" data-testid="card-error">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 rounded-full bg-destructive/10">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground max-w-md" data-testid="text-error-message">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline"
            data-testid="button-retry"
          >
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
