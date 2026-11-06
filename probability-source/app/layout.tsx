
import type { Metadata } from "next";
import "./globals.css";
import "../../theme-backgrounds.css";
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

// Restore the persistent site-wide theme before first paint.
const themeInit = `try{var t=localStorage.getItem("limitless.site.theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* Load the same account and cloud-sync runtime on every exported route,
            including nested book pages (not just the Probability landing page). */}
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" />
        <script src="/supabase/config.js" />
        <script src="/supabase/client.js" />
        <script src="/supabase/cloud-sync.js" />
        <script src="/supabase/auth.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
