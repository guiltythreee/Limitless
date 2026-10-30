
import type { Metadata } from "next";
import "./globals.css";
import "../../shared/learning-player/player.css";

export const metadata: Metadata = {
  title: "Limitless Probability — The Probability Archive",
  description:
    "A gothic academic archive for learning probability, from first principles to stochastic processes.",
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
