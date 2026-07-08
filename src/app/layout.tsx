import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cupertino Voices",
    template: "%s | Cupertino Voices",
  },
  description:
    "An interactive community history archive documenting Cupertino, California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&family=Newsreader:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />

        {children}

        <footer className="site-panel-footer">
          <div className="site-panel-footer-inner">
            <div className="site-panel-brand">
              <h3>
                A living archive of Cupertino,{" "}
                <em className="site-panel-brand-muted">by Cupertino.</em>
              </h3>
              <p>
                Stories, photographs, and oral histories of the people, places,
                and memories that built the city.
              </p>
            </div>

            <div className="site-panel-col">
              <h4>Explore</h4>
              <ul>
                <li><Link href="/story">Our Story</Link></li>
                <li><Link href="/timeline">Timeline</Link></li>
                <li><Link href="/map">Interactive Map</Link></li>
                <li><Link href="/archive">Archive</Link></li>
              </ul>
            </div>

            <div className="site-panel-col">
              <h4>Get Involved</h4>
              <ul>
                <li>Contribute a Story</li>
                <li>Volunteer</li>
              </ul>
            </div>

            <div className="site-panel-col">
              <h4>Project</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="site-panel-bar">
            <span>© 2026 Cupertino Voices · A Community Archive</span>
            <span>Made in California</span>
          </div>
        </footer>
      </body>
    </html>
  );
}