import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "innerloop — The Next Interface Is Thought",
  description: "Subvocal AI headphones that turn inner monologue into conversation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
