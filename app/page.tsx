import Hero from "./components/Hero";
import Services from "./components/Services";
import AboutUs from "./components/AboutUs";
import Reviews from "./components/Reviews";
import HowItWorks from "./components/HowItWorks";
import Blog from "./components/Blog";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import {
  getPageHero,
  getSection,
  getFaqsForSlug,
  getSiteSettings,
  getTestimonials,
} from "./lib/cms";
import { getPosts } from "./lib/db";
import JsonLd from "./components/JsonLd";
import { faqPageSchema, graph } from "./lib/structured-data";

export const revalidate = 3600;
export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [sectionHero, pageHero, testimonials, settings, posts, faqs] =
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
  };
  return (
    <>
      <JsonLd data={graph(faqPageSchema(faqs))} />
      <Hero content={(hero ?? {}) as never} />
      <Services />
      <AboutUs />
      <HowItWorks />
      <Blog posts={posts.slice(0, 4)} />
      <Reviews items={testimonials} />
      <CTA />
      <Contact settings={(settings ?? {}) as never} />
    </>
  );
}
