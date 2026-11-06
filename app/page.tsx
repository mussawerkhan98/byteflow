import Hero from "./components/Hero";
import Services from "./components/Services";
import SelectedWork from "./components/SelectedWork";
import NeedsSection from "./components/NeedsSection";
import AboutUs from "./components/AboutUs";
import ServicePromise from "./components/ServicePromise";
import TechStack from "./components/TechStack";
import Reviews from "./components/Reviews";
import HowItWorks from "./components/HowItWorks";
import HelpPanel from "./components/HelpPanel";
import Blog from "./components/Blog";
import CTA from "./components/CTA";
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
import JsonLd from "./components/JsonLd";
import { faqPageSchema, graph } from "./lib/structured-data";

export const revalidate = 3600;
export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [sectionHero, pageHero, testimonials, settings, posts, faqs, process, figures] =
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
      // How it works runs in the browser, so its admin content is read here.
      getHomeBlock("home_process"),
      getSiteFigures(),
    ]);
  const hero = {
    ...(sectionHero ?? {}),
    ...(pageHero?.hero_label ? { badge: pageHero.hero_label } : {}),
    ...(pageHero?.hero_heading ? { heading: pageHero.hero_heading } : {}),
    ...(pageHero?.hero_description
      ? { description: pageHero.hero_description }
      : {}),
    ...(pageHero?.hero_background_image
      ? { backgroundImage: pageHero.hero_background_image }
      : {}),
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
          ["image", pageHero?.hero_image],
          ["imageAlt", pageHero?.hero_image_alt],
          ["stripText", pageHero?.hero_strip_text],
          ["stripLinkLabel", pageHero?.hero_strip_link_label],
          ["stripLink", pageHero?.hero_strip_link],
        ] as const
      ).filter(([, value]) => value),
    ),
  };
  return (
    <>
      <JsonLd data={graph(faqPageSchema(faqs))} />
      <Hero
        content={(hero ?? {}) as never}
        phone={String(settings?.header_phone || "") || undefined}
        whatsappUrl={String(settings?.whatsapp_link || "") || undefined}
        figures={figures}
      />
      <Services />
      <SelectedWork />
      <NeedsSection />
      <AboutUs />
      <ServicePromise />
      <TechStack />
      <HowItWorks content={process} />
      <HelpPanel />
      <Blog posts={posts.slice(0, 4)} />
      <Reviews items={testimonials} figures={figures} />
      <CTA />
      <Contact settings={(settings ?? {}) as never} />
    </>
  );
}
