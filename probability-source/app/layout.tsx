
import type { Metadata } from "next";
import "./globals.css";
import "../../shared/learning-player/player.css";
import "../../shared/studies/landing.css";
import "../../shared/studies/study-utility-nav.css";
import "../../shared/studies/study-navigation.css";

export const metadata: Metadata = {
  title: "Limitless Probability — The Probability Archive",
  description:
    "A gothic academic archive for learning probability, from first principles to stochastic processes.",
  icons: {
    icon: [
      {
        url: "/probability/brand-icon-light.webp",
        type: "image/webp",
        sizes: "512x512",
      },
    ],
    shortcut: ["/probability/brand-icon-light.webp"],
    apple: ["/probability/brand-icon-light.webp"],
  },
};

// Keep the existing theme key so saved dark/light preferences continue working.
const themeInit = `try{var t=localStorage.getItem("hc3-theme");if(t!=="light"&&t!=="dark"){t="dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
