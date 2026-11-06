import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookkeys Migration Preview",
  description: "Isolated TypeScript migration workspace for Limitless Bookkeys.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
