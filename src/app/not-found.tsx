import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-lg mx-4 border border-primary/30 bg-card/85 backdrop-blur-md shadow-2xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-rose-500" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>

          <h2 className="text-xl font-bold text-primary mb-4">
            Page Not Found
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
            Sorry, the page you are looking for doesn&apos;t exist in the OSSCCU network.
            <br />
            It may have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-2.5 rounded-lg neon-button">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Platform
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
