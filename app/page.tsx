import "./home.css";
import HomeHero from "./components/home/HomeHero";
import HomeServices from "./components/home/HomeServices";
import HomeWork from "./components/home/HomeWork";
import HomeNeeds from "./components/home/HomeNeeds";
import HomeAbout from "./components/home/HomeAbout";
import HomePromise from "./components/home/HomePromise";
import HomeTech from "./components/home/HomeTech";
import HomeInsights from "./components/home/HomeInsights";
import HomeReviews from "./components/home/HomeReviews";
import HomeProcess from "./components/home/HomeProcess";
import HomeMotion from "./components/home/HomeMotion";
import HelpPanel from "./components/HelpPanel";
import Contact from "./components/Contact";
import {
  getPageHero,
  getSection,
  getFaqsForSlug,
  getSiteFigures,
  getSiteSettings,
  getTestimonials,
} from "./lib/cms";
import { getPosts } from "./lib/db";
import { getHomeBlock } from "./lib/home-blocks";
import { lines } from "./lib/home-content";
import JsonLd from "./components/JsonLd";
import { faqPageSchema, graph } from "./lib/structured-data";

export const revalidate = 3600;
export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [sectionHero, pageHero, testimonials, settings, posts, faqs, process, figures, contact] =
    await Promise.all([
      getSection("home", "hero"),
      getPageHero("home"),
      getTestimonials(),
      getSiteSettings(),
      getPosts(),
      // The FAQ block itself is rendered in the browser by PageFaq. This
      // reads the same rows on the server purely so the questions are in the
      // HTML a crawler receives — the markup still only describes what a
      // visitor sees on the page.
      getFaqsForSlug("home"),
      // How it works (the process timeline).
      getHomeBlock("home_process"),
      getSiteFigures(),
      // The contact form runs in the browser too.
      getHomeBlock("home_contact"),
    ]);
  const hero = {
    ...(sectionHero ?? {}),
    ...(pageHero?.hero_label ? { badge: pageHero.hero_label } : {}),
    ...(pageHero?.hero_heading ? { heading: pageHero.hero_heading } : {}),
    ...(pageHero?.hero_description
      ? { description: pageHero.hero_description }
      : {}),
    // The picture on the right (Pages → Home → Top banner), else the
    // built-in photograph (lib/home-photos.ts). The home banner has no
    // background picture, so hero_background_image is not used here.
    // Always from the banner, so an older saved hero section can't supply one.
    image: pageHero?.hero_image || "",
    imageAlt: pageHero?.hero_image_alt || "",
    ...(pageHero?.hero_primary_label
      ? { primaryButtonLabel: pageHero.hero_primary_label }
      : {}),
    ...(pageHero?.hero_primary_link
      ? { primaryButtonLink: pageHero.hero_primary_link }
      : {}),
    ...(pageHero?.hero_secondary_label
      ? { secondaryButtonLabel: pageHero.hero_secondary_label }
      : {}),
    ...(pageHero?.hero_secondary_link
      ? { secondaryButtonLink: pageHero.hero_secondary_link }
      : {}),
    // The home page's extra fields. Blank ones are left out, so the hero
    // shows its own wording for them.
    ...Object.fromEntries(
      (
        [
          ["highlight", pageHero?.hero_highlight],
          ["trustLine", pageHero?.hero_trust_line],
          ["stripText", pageHero?.hero_strip_text],
          ["stripLinkLabel", pageHero?.hero_strip_link_label],
          ["stripLink", pageHero?.hero_strip_link],
        ] as const
      ).filter(([, value]) => value),
    ),
  };
  return (
    // .hp scopes the home page's design system (globals.css, "Home page").
    <div className="hp">
      <JsonLd data={graph(faqPageSchema(faqs))} />
      <HomeMotion />
      <HomeHero
        content={(hero ?? {}) as never}
        phone={String(settings?.header_phone || "") || undefined}
        whatsappUrl={String(settings?.whatsapp_link || "") || undefined}
        figures={figures}
      />
      <HomeServices />
      <HomeWork />
      <HomeNeeds />
      <HomeAbout />
      <HomePromise />
      <HomeTech />
      <HomeInsights posts={posts} />
      <HomeProcess content={process} />
      <HelpPanel />
      <HomeReviews items={testimonials} figures={figures} />
      {/* "Ready to upgrade your IT setup?" and the contact form, as one section. */}
      <Contact
        settings={(settings ?? {}) as never}
        cta={{
          eyebrow: contact.fields.eyebrow,
          heading: contact.fields.heading,
          heading_soft: contact.fields.heading_soft,
          intro: contact.fields.intro,
          call_label: contact.fields.call_label,
          whatsapp_label: contact.fields.whatsapp_label,
          promises: lines(contact.fields.promises),
        }}
      />
    </div>
  );
}
