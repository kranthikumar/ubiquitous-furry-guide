import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FurryTube",
    template: "%s · FurryTube",
  },
  description:
    "Watch fursuit vlogs, art, animation, gaming and more from the furry community.",
};

export const viewport: Viewport = {
  themeColor: "#f8f9fb",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roboto.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
