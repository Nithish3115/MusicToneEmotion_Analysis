import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <a className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3" data-testid="link-home">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary to-chart-2">
                <Music className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Audio Emotion AI
              </span>
            </a>
          </Link>

          <nav className="flex items-center gap-2" role="navigation" aria-label="Main navigation">
            <Link href="/">
              <Button
                variant={location === "/" ? "secondary" : "ghost"}
                size="default"
                data-testid="button-nav-home"
              >
                Home
              </Button>
            </Link>
            <Link href="/upload">
              <Button
                variant={location === "/upload" ? "secondary" : "ghost"}
                size="default"
                data-testid="button-nav-upload"
              >
                Upload
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
