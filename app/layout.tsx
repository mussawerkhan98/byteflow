import type { Metadata } from "next";
import { Space_Grotesk, Cardo } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyContactButtons from "./components/StickyContactButtons";
import PageCta from "./components/PageCta";
import PageFaq from "./components/PageFaq";
import { getMenu, getPageMetadata, getSiteSettings } from "./lib/cms";
import { getServices } from "./lib/db";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

const cardo = Cardo({
  subsets: ["latin"],
  variable: "--font-cardo",
  weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...((await getPageMetadata("home")) ?? {
      title: "Byteflow Information Technology",
      description:
        "Leading IT solutions provider trusted by 500+ businesses across Dubai and UAE since 2017.",
    }),
    verification: { google: "tAM-FG-hPH1-sxVzCRVhEVnLM0OhIATbEoeYXTTShc4" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, headerMenu, footerMenu, services] = await Promise.all([
    getSiteSettings(),
    getMenu("header"),
    getMenu("footer"),
    getServices(),
  ]);
  type MenuNode = {
    label: string;
    href: string;
    new_tab: boolean;
    children: MenuNode[];
  };
  const buildTree = (
    records: typeof headerMenu,
    parent: number | null = null,
  ): MenuNode[] =>
    records
      .filter((item) => item.parent_id === parent)
      .map((item) => ({
        label: item.label,
        href: item.href,
        new_tab: item.new_tab,
        children: buildTree(records, item.id),
      }));
  const headerNavigation = headerMenu.length
    ? buildTree(headerMenu)
    : undefined;
  const footerNavigation = footerMenu.length
    ? footerMenu
        .filter((item) => item.parent_id === null)
        .map((item) => ({
          label: item.label,
          href: item.href,
          new_tab: item.new_tab,
        }))
    : undefined;
  const serviceLinks =
    !headerMenu.length && services.length
      ? services.map((service) => ({
          label: service.title,
          href: `/${service.slug}`,
        }))
      : undefined;
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${cardo.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col text-[var(--text-primary)]"
        style={{
          fontFamily: "var(--font-space), sans-serif",
          background: "var(--bg-page)",
        }}
      >
        <Header
          navigation={headerNavigation}
          serviceLinks={serviceLinks}
          logoUrl={String(settings?.logo_url || "/images/logo.png")}
        />
        <main className="flex-1">{children}</main>
        <PageFaq />
        <PageCta />
        <Footer
          navigation={footerNavigation}
          settings={(settings ?? {}) as never}
        />
        <StickyContactButtons />
      </body>
      <GoogleAnalytics gaId="G-0D6S22JEGG" />
    </html>
  );
}
