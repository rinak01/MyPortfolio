import { Newsreader, Space_Mono } from "next/font/google";

/* The tank hero and the Selected Projects cards share one type pairing.
   Declared once here: calling next/font twice for the same family in two
   modules emits two sets of @font-face rules for the same files. */

// Newsreader is a variable face, so it takes no weight array.
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--tk-serif",
});

// Space Mono is static and needs its two cuts named.
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--tk-mono",
});
