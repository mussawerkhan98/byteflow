import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Plus_Jakarta_Sans, Outfit } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { connection } from "next/server";
// Font Awesome's CSS sizes the icons app/components/Icon.tsx draws (it ships
// none of the library's JavaScript).
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyContactButtons from "./components/StickyContactButtons";
import LeadTracking from "./components/LeadTracking";
import InquiryDrawer from "./components/InquiryDrawer";
import PageCta from "./components/PageCta";
import PageSections from "./components/PageSections";
import PageFaq from "./components/PageFaq";
import { getMenu, getPageMetadata, getServiceNames, getSiteFigures, getSiteSettings, getWebsiteScripts } from "./lib/cms";
import { splitHeadCode } from "./lib/head-code";
import { getHeaderModel } from "./lib/header-data";
import JsonLd from "./components/JsonLd";
import { organizationSchemaWith, publishesOrganization } from "./lib/structured-data";
import { figuresFrom, type SiteFigures } from "./lib/site-figures";

// Both are variable fonts, so the weight axis is loaded in one file each
// instead of one request per weight.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Only the footer wordmark uses this, so just the weight it is set in is
// pulled down rather than the whole axis. Not preloaded: it is at the very
// bottom of the page and would otherwise compete with the hero for bandwidth.
const outfit = Outfit({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-wordmark",
  display: "swap",
  preload: false,
});


const fallbackTitle = "IT Support | IT AMC Support | Managed IT Services UAE";
// Quotes the site-wide figures, so it says what the pages say.
const fallbackMetadata = (figures: SiteFigures): Metadata => {
  const description = `Leading IT solutions provider trusted by ${figures.clients} businesses across Dubai and UAE since ${figures.founded}.`;
  return { title: fallbackTitle, description, openGraph: { title: fallbackTitle, description } };
};

export async function generateMetadata(): Promise<Metadata> {
  const [cms, figures] = await Promise.all([getPageMetadata("home"), getSiteFigures()]);
  return {
    metadataBase: new URL("https://www.byteflow.ae"),
    // Matches the live home page, so an unreachable database never
    // publishes a different title.
    ...(cms ?? fallbackMetadata(figures)),
    verification: { google: "tAM-FG-hPH1-sxVzCRVhEVnLM0OhIATbEoeYXTTShc4" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reverted to request-time rendering: edits made in the admin panel
  // have to appear on the site straight away, which a cached page
  // cannot do. This opts every page out of static rendering.
  await connection();
  const [settings, headerModel, footerMenu, scripts, serviceNames] = await Promise.all([
    getSiteSettings(),
    getHeaderModel(),
    getMenu("footer"),
    getWebsiteScripts(),
    getServiceNames(),
  ]);
  // Admin <meta>/<link> tags go in <head>; the scripts and JSON-LD go first in <body>.
  const { tags: headTags, rest: headScripts } = splitHeadCode(
    scripts.filter((script) => script.placement === "head").map((script) => script.code).join("\n"),
  );
  const footerScripts = scripts.filter((script) => script.placement === "body_end").map((script) => script.code).join("\n");
  const footerNavigation = footerMenu.length
    ? footerMenu
        .filter((item) => item.parent_id === null)
        .map((item) => ({
          label: item.label,
          href: item.href,
          new_tab: item.new_tab,
        }))
    : undefined;
  return (
    // The site has one theme, light. data-theme stays on <html> because the
    // stylesheets key their light colours off it.
    <html
      lang="en"
      data-theme="light"
      className={`${jakarta.variable} ${sora.variable} ${outfit.variable} h-full antialiased`}
    >
      {/* React and Next add stylesheets and metadata to <head>, so it must stay
          a normal element. Setting its innerHTML wiped those tags, and React
          then crashed removing them ("reading 'removeChild'"). */}
      <head>
        {headTags.map(({ tag, attrs }, i) =>
          tag === "meta" ? <meta key={i} {...attrs} /> : <link key={i} {...attrs} />,
        )}
      </head>
      <body
        className="min-h-full flex flex-col text-[var(--text-primary)]"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          background: "var(--bg-page)",
        }}
      >
        {/* The organization every other node points at. Normally the admin's
            "Address" script publishes it; this stands in when none does. */}
        {!publishesOrganization(headScripts + footerScripts) && <JsonLd data={organizationSchemaWith(figuresFrom(settings))} />}
        {/* Admin "head" scripts and JSON-LD run first thing in the body, the
            same way the body-end ones are placed below. */}
        {headScripts && (
          <div
            data-cms-scripts="head"
            style={{ display: "contents" }}
            dangerouslySetInnerHTML={{ __html: headScripts }}
          />
        )}
        <Header
          model={headerModel}
          logoUrl={String(settings?.logo_url || "/images/logo.png")}
          phone={String(settings?.header_phone || "") || undefined}
          whatsappUrl={String(settings?.whatsapp_link || "") || undefined}
        />
        {/* Everything under the header clips what reaches past the sides, so
            no section can ever make the page wider than the screen and let it
            slide sideways on a phone. clip, not hidden: no scroll box, so
            sticky elements inside still stick. */}
        <div className="page-clip flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
          <PageSections placement="before_faq" />
          <PageCta />
          <PageFaq />
          <PageSections placement="after_faq" />
          <Footer
            navigation={footerNavigation}
            settings={(settings ?? {}) as never}
            serviceNames={Object.fromEntries(serviceNames)}
            year={new Date().getFullYear()}
          />
        </div>
        <StickyContactButtons />
        <InquiryDrawer />
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}
        {footerScripts && (
          <div
            data-cms-scripts="body-end"
            style={{ display: "contents" }}
            dangerouslySetInnerHTML={{ __html: footerScripts }}
          />
        )}
        <LeadTracking />
      </body>
      <GoogleAnalytics gaId="G-0D6S22JEGG" />
    </html>
  );
}
