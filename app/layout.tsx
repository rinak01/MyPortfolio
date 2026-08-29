import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESCRIPTION =
  "Portfolio of Rina Kim, Product Designer specializing in Automotive HMI, Interface Design, and Prototyping.";

export const metadata: Metadata = {
  // Relative OG image paths need a base to resolve against. Swap in the real
  // domain when the site is deployed; localhost keeps dev previews resolving.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Rina Kim · Product Designer",
  description: DESCRIPTION,
  openGraph: {
    title: "Rina Kim · Product Designer",
    description: DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/images/prototypes/LuminousJellyfish/reef_dusk.jpg",
        width: 1600,
        height: 900,
        alt: "A reef tank lit from above, drawn in soft gouache.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rina Kim · Product Designer",
    description: DESCRIPTION,
    images: ["/images/prototypes/LuminousJellyfish/reef_dusk.jpg"],
  },
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
