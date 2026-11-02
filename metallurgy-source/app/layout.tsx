import type { Metadata } from "next";
import "./globals.css";
import "../../theme-backgrounds.css";
import "../../shared/learning-player/player.css";
import "../../shared/studies/landing.css";
import "../../shared/studies/study-utility-nav.css";
import "../../shared/studies/workspace-layout.css";
import "../../shared/studies/study-navigation.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Metallurgical & Materials Engineering — Archive",
  description:
    "Study metallurgy and materials engineering, practise chapter-wise MCQs with detailed solutions, and track your progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* choose the theme before first paint so there is no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload')sessionStorage.removeItem('limitless.site.theme');var t=sessionStorage.getItem('limitless.site.theme');if(t!=='dark'&&t!=='light')t='dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body>
        <div className="bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
