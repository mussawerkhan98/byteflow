import "./home.css";
import type { Metadata } from "next";
import Link from "next/link";

// Every unmatched URL and every notFound() call renders this page.
// Without it, the 404 inherited the home page title from layout.tsx.
export const metadata: Metadata = {
  title: "Page Not Found | Byteflow",
  description: "The page you were looking for does not exist or has moved.",
  robots: { index: false, follow: true },
  openGraph: { title: "Page Not Found | Byteflow" },
};

const links = [
  { label: "IT AMC Services", href: "/it-amc-services-dubai" },
  { label: "Cyber Security", href: "/cyber-security" },
  { label: "Cloud Services", href: "/cloud-services-dubai" },
  { label: "Website Development", href: "/website-development" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

/** In the home page's design (.hp, home.css): its eyebrow, h1, lead and pill links. */
export default function NotFound() {
  return (
    <div className="hp">
      <section className="page-container py-20 text-center sm:py-28">
        <p className="hp-eyebrow">Error 404</p>
        <h1 className="hp-h1 mx-auto mt-5 max-w-3xl">This page doesn&rsquo;t exist</h1>
        <p className="hp-lead mx-auto mt-5 max-w-xl">
          The link may be broken or the page may have moved. Try one of these instead:
        </p>
        <ul className="mt-9 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex items-center rounded-full border border-[var(--hp-line-strong)] bg-[var(--hp-card)] px-5 py-2.5 text-[15px] font-semibold text-[var(--hp-ink)] transition-colors hover:border-[var(--hp-accent)] hover:text-[var(--hp-accent)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link href="/" className="hp-textlink">
            Back to the home page
          </Link>
        </p>
      </section>
    </div>
  );
}
