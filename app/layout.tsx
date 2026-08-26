import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rina Kim · Product Designer",
  description: "Portfolio of Rina Kim, Product Designer specializing in Automotive HMI, Interface Design, and Prototyping.",
};

// mobile fix: explicit viewport for correct initial scale + safe-area on notched devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0C0C0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The theme lives on <html> so the root background, the overscroll
    // bounce and themeColor above all resolve to the same palette. Held
    // on an inner div it left <body> painting the light ground, which
    // showed as a cream flash on rubber-band scroll.
    <html lang="en" data-theme="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
