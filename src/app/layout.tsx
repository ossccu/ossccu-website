import { Toaster } from "@/frontend/components/ui/sonner";
import { TooltipProvider } from "@/frontend/components/ui/tooltip";
import ErrorBoundary from "@/frontend/components/ErrorBoundary";
import { ThemeProvider } from "@/frontend/contexts/ThemeContext";
import { AuthProvider } from "@/frontend/contexts/AuthContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSS CCU - Open Source Software Community at City University",
  description:
    "Join the Open Source Software Community at City University (OSS CCU). Collaborate, build, and ship amazing production-grade open-source software together.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
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
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                {children}
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
