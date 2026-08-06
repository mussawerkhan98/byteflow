import Hero from "./components/Hero";
import Services from "./components/Services";
import AboutUs from "./components/AboutUs";
import Reviews from "./components/Reviews";
import HowItWorks from "./components/HowItWorks";
import Blog from "./components/Blog";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Team from "./components/Team";
import {
  getPageHero,
  getSection,
  getSiteSettings,
  getTeam,
  getTestimonials,
} from "./lib/cms";

export default async function Home() {
  const [sectionHero, pageHero, testimonials, team, settings] =
    await Promise.all([
      getSection("home", "hero"),
      getPageHero("home"),
      getTestimonials(),
      getTeam("home"),
      getSiteSettings(),
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
      <Hero content={(hero ?? {}) as never} />
      <Services />
      <AboutUs />
      <HowItWorks />
      <Blog />
      <Reviews items={testimonials} />
      <Team members={team} />
      <CTA />
      <Contact settings={(settings ?? {}) as never} />
    </>
  );
}
