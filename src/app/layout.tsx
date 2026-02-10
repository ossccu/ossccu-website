import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSSCCU - Open Source Software Community at City University",
  description: "Join the Open Source Software Community at City University. Collaborate, learn, and create amazing projects together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider
            defaultTheme="dark"
            // switchable
          >
            <TooltipProvider>
              <Toaster />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
