import { getProjects } from "../lib/db";
import ProjectsClient, { type UiProject, CATEGORIES } from "./ProjectsClient";
import { getPageHero, getPageMetadata } from "../lib/cms";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const cms = await getPageMetadata('projects')
  return {
    ...(cms ?? {
      title: 'Our Projects | IT & Software Case Studies Dubai',
      description: 'See how Byteflow delivered IT infrastructure, software and support for businesses across Dubai and the UAE.',
    }),
    alternates: { canonical: '/projects' },
  }
}

function categoryToVisual(category: string): string {
  const map: Record<string, string> = {
    "IT Support": "it",
    "Cyber Security": "cyber",
    "Cloud Services": "cloud",
    "Web & Apps": "web",
    "Digital Marketing": "marketing",
    "System Integration": "integration",
    "UI/UX Design": "design",
  };
  return map[category] ?? "it";
}

function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function ProjectsPage() {
  const [dbProjects, hero] = await Promise.all([
    getProjects(),
    getPageHero("projects"),
  ]);
  const uiProjects: UiProject[] = dbProjects.map((project) => ({
    slug: project.slug,
    client: project.title,
    industry: project.industry,
    category: project.category,
    year: project.year,
    title: project.title,
    story: plainText(project.description),
    deliverables: project.bullet_points,
    metrics: project.metrics,
    tags: project.tags,
    featured: project.featured,
    image: project.image_url ?? "",
    visual: categoryToVisual(project.category),
  }));

  return (
    <>
      <div
        className="h-44 bg-cover bg-center"
        style={
          hero?.hero_background_image
            ? {
                backgroundImage: `linear-gradient(rgba(4,13,18,.55),rgba(4,13,18,.95)),url(${hero.hero_background_image})`,
              }
            : undefined
        }
      >
        {hero?.hero_heading && (
          <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-8">
            <h1 className="text-4xl font-bold text-white">
              {hero.hero_heading}
            </h1>
          </div>
        )}
      </div>
      <ProjectsClient projects={uiProjects} />
    </>
  );
}

export { CATEGORIES };
