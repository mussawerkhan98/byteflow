"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoLink from "./LogoLink";
import { ArrowIcon, ArrowUpRightIcon, ChevronIcon, PhoneIcon, WhatsAppIcon } from "./InlineIcons";
import { ServiceIcon } from "./ServiceIcon";
import { isCurrent, type NavItem } from "../lib/header-menu";
import { fallbackHeader, type HeaderModel, type MenuGroup, type MenuLink, type PostCard } from "../lib/header-model";

export type { NavItem };

const DEFAULT_PHONE = "+971 54 328 2042";

// How long the pointer rests on a menu before it opens, and how long it may
// stray off one (cutting a corner on the way to the panel) before it closes.
const HOVER_DELAY = 150;

const newTabProps = (item: { new_tab?: boolean }) =>
  item.new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {};

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Top-level links and dropdown buttons: a cyan pill marks hover, an open menu and the current page. */
const pillClass = (active: boolean) =>
  `site-pill ${active ? "is-active " : ""}inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-[13px] py-[9px] text-[14.5px] font-medium leading-5 transition-colors duration-200 ${
    active
      ? "bg-[rgba(44,205,222,0.12)] text-[#2CCDDE]"
      : "text-[#e2e8f0] hover:bg-[rgba(44,205,222,0.12)] hover:text-[#2CCDDE]"
  }`;

const eyebrowClass = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0e9aa8]";

/** The white panels share one surface. */
const panelSurface =
  "overflow-hidden rounded-[20px] bg-white text-left shadow-[0_32px_80px_-24px_rgba(4,18,26,0.5),0_8px_24px_-8px_rgba(4,18,26,0.18)] ring-1 ring-[rgba(15,23,42,0.06)]";

// ── Desktop panels ─────────────────────────────────────────────────────────

/** A light intro column on the left of a mega menu. */
function IntroZone({
  eyebrow,
  heading,
  text,
  link,
  outward = false,
  onNavigate,
}: {
  eyebrow: string;
  heading: string;
  text: string;
  link: MenuLink;
  /** A ↗ arrow (for a list that continues elsewhere) instead of →. */
  outward?: boolean;
  onNavigate: () => void;
}) {
  return (
    // At 1024px the intro gives its room to the columns beside it.
    <div className="hidden flex-col border-r border-[#e2e8f0] bg-[#f1f6fa] p-7 xl:flex">
      <p className={eyebrowClass}>{eyebrow}</p>
      <p className="mt-3 font-display text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0b1724]">
        {heading}
      </p>
      {text && <p className="mt-3 text-[13.5px] leading-relaxed text-[#64748b]">{text}</p>}
      <Link
        href={link.href}
        onClick={onNavigate}
        className="group/all mt-auto inline-flex items-center gap-1.5 pt-6 text-[13.5px] font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
      >
        {link.label}
        {outward ? (
          <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:-translate-y-px group-hover/all:translate-x-px" />
        ) : (
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
        )}
      </Link>
    </div>
  );
}

/** Small uppercase column heading, two lines tall so the rules under them line up. */
function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 flex min-h-[2.75rem] items-end border-b border-[#e2e8f0] px-2 pb-2.5 text-[11px] font-semibold uppercase leading-[1.45] tracking-[0.12em] text-[#94a3b8]">
      {children}
    </p>
  );
}

/** The grey strip along the bottom of a mega menu. */
function FooterStrip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-3.5 text-[13.5px]">
      {children}
    </div>
  );
}

// How long the pointer must rest on a row before the preview follows it, so
// cutting across other rows on the way to the preview leaves it alone.
const PICK_DELAY = 110;

/**
 * Which row of a panel is being previewed: the one pointed at (after
 * PICK_DELAY) or focused. Back to none when the panel closes.
 */
function usePick(open: boolean) {
  const [picked, setPicked] = useState<string | null>(null);
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setPicked(null);
  }
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const cancel = () => clearTimeout(timer.current);
  const pick = (key: string) => ({
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancel();
      timer.current = window.setTimeout(() => setPicked(key), PICK_DELAY);
    },
    onPointerLeave: cancel,
    onFocus: () => {
      cancel();
      setPicked(key);
    },
  });
  return { picked, pick, cancel };
}

/**
 * Every preview picture stacked in one frame, the current one faded in, so
 * moving between rows swaps at once instead of waiting for a download.
 */
function PictureStack({
  pictures,
  current,
  show,
  sizes,
}: {
  pictures: { src: string; alt: string }[];
  current: string | null;
  /** Pictures load once the menu has been opened, not on every page view. */
  show: boolean;
  sizes: string;
}) {
  return (
    <>
      {show &&
        pictures.map((picture) => (
          <Image
            key={picture.src}
            src={picture.src}
            alt={picture.src === current ? picture.alt : ""}
            fill
            sizes={sizes}
            unoptimized={!picture.src.startsWith("/")}
            className={`object-cover transition-opacity duration-300 ${picture.src === current ? "opacity-100" : "opacity-0"}`}
          />
        ))}
    </>
  );
}

/** One copy of each picture, in order. */
const uniquePictures = (pictures: { src: string | null; alt: string }[]) =>
  [...new Map(pictures.flatMap((p) => (p.src ? [[p.src, { src: p.src, alt: p.alt }] as const] : []))).values()];

/** The Services menu's right column while a service is pointed at. */
function ServicePreviewCard({
  item,
  group,
  button,
  pictures,
  showImages,
  onNavigate,
}: {
  item: MenuGroup["items"][number];
  group: string;
  button: string;
  pictures: { src: string; alt: string }[];
  showImages: boolean;
  onNavigate: () => void;
}) {
  const preview = item.preview;
  return (
    <div className="relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-[#0b1724] p-3 text-white">
      <div className="relative h-[112px] shrink-0 overflow-hidden rounded-xl bg-[#11263a]">
        {/* No picture yet: the service's icon on a fine grid. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(rgba(44,205,222,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(44,205,222,0.08)_1px,transparent_1px)] bg-[size:18px_18px]"
        />
        <span
          aria-hidden="true"
          className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(44,205,222,0.35),transparent_68%)]"
        />
        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-xl bg-[#2CCDDE] text-[#04121A] shadow-[0_0_32px_rgba(44,205,222,0.45)]"
        >
          <ServiceIcon link={item.href} className="h-6 w-6" />
        </span>
        <PictureStack pictures={pictures} current={preview?.image ?? null} show={showImages} sizes="290px" />
      </div>
      <div key={item.href} className="menu-preview-in flex flex-1 flex-col px-3 pb-2 pt-4">
        {group && <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2CCDDE]">{group}</p>}
        <p className="mt-1.5 font-display text-[18px] font-semibold leading-tight tracking-[-0.02em]">{item.label}</p>
        {preview?.subtitle && (
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[#cbd5e1]">{preview.subtitle}</p>
        )}
        <div className="mt-auto pt-4">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group/plans inline-flex h-10 items-center gap-2.5 rounded-full bg-[#2CCDDE] pl-4 pr-1 text-[13.5px] font-bold text-[#04121A] transition-colors hover:bg-[#5BDCE9]"
          >
            {button}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE]">
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/plans:-translate-y-px group-hover/plans:translate-x-px" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServicesPanel({
  services,
  whatsapp,
  open,
  showImages,
  onNavigate,
}: {
  services: HeaderModel["services"];
  whatsapp: string;
  open: boolean;
  showImages: boolean;
  onNavigate: () => void;
}) {
  const { intro, groups, featured, preview, footer } = services;
  const { picked, pick, cancel } = usePick(open);
  const rows = preview ? groups.flatMap((group) => group.items.map((item) => ({ item, group: group.title }))) : [];
  // With no featured card, the first service stands in until one is pointed at.
  const shown = rows.find((row) => row.item.href === picked) ?? (featured ? null : rows[0]) ?? null;
  // The card keeps the last service while it fades back to the featured card.
  const [lastHref, setLastHref] = useState<string | null>(null);
  if (shown && shown.item.href !== lastHref) setLastHref(shown.item.href);
  const card = shown ?? rows.find((row) => row.item.href === lastHref) ?? rows[0];
  const pictures = uniquePictures(rows.map((row) => ({ src: row.item.preview?.image ?? null, alt: row.item.preview?.alt ?? "" })));
  const side = Boolean(featured || shown);
  return (
    <div className={panelSurface}>
      <div
        className={`grid ${
          side
            ? "lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[250px_minmax(0,1fr)_290px]"
            : "xl:grid-cols-[250px_minmax(0,1fr)]"
        }`}
      >
        <IntroZone {...intro} onNavigate={onNavigate} />

        <div className="grid grid-cols-3 gap-x-2 gap-y-5 p-5">
          {groups.map((group) => (
            <div key={group.title} className="min-w-0">
              <ColumnTitle>{group.title}</ColumnTitle>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      {...(preview ? pick(item.href) : {})}
                      className={`group/item flex items-start gap-2.5 rounded-xl p-2 transition-colors duration-150 hover:bg-[#ecfbfd] ${
                        shown?.item === item ? "bg-[#ecfbfd]" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(44,205,222,0.12)] text-[#0e7490] transition-colors duration-150 group-hover/item:bg-[#2CCDDE] group-hover/item:text-[#04121A]"
                      >
                        <ServiceIcon link={item.href} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold leading-snug text-[#0b1724]">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-[#64748b]">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {side && (
          // Resting on the card keeps the service it shows.
          <div className="relative p-3 lg:pl-0" onPointerEnter={cancel}>
            {featured && (
              <div
                inert={Boolean(shown)}
                className={`relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-[#0b1724] p-6 text-white transition-opacity duration-200 ${
                  shown ? "opacity-0" : "opacity-100"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(44,205,222,0.32),transparent_68%)]"
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2CCDDE]">{featured.eyebrow}</p>
                <p className="mt-2 font-display text-[22px] font-semibold leading-tight tracking-[-0.02em]">
                  {featured.title}
                </p>
                {featured.text && <p className="mt-2 text-[13px] leading-relaxed text-[#cbd5e1]">{featured.text}</p>}
                {featured.stats.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {featured.stats.map((stat) => (
                      <p key={stat.value + stat.label} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3">
                        <span className="block font-display text-[20px] font-semibold leading-none text-[#2CCDDE]">{stat.value}</span>
                        <span className="mt-1.5 block text-[12px] leading-snug text-[#cbd5e1]">{stat.label}</span>
                      </p>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-6">
                  <Link
                    href={featured.button.href}
                    onClick={onNavigate}
                    className="group/plans inline-flex h-10 items-center gap-2.5 rounded-full bg-[#2CCDDE] pl-4 pr-1 text-[13.5px] font-bold text-[#04121A] transition-colors hover:bg-[#5BDCE9]"
                  >
                    {featured.button.label}
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE]">
                      <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/plans:-translate-y-px group-hover/plans:translate-x-px" />
                    </span>
                  </Link>
                </div>
              </div>
            )}
            {/* Over the featured card, at its size; on its own without one. */}
            {preview && rows.length > 0 && (
              <div
                inert={!shown}
                className={`${featured ? "absolute inset-3 lg:left-0" : "h-full min-h-[280px]"} transition-opacity duration-200 ${
                  shown ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <ServicePreviewCard
                  item={card.item}
                  group={card.group}
                  button={preview.button}
                  pictures={pictures}
                  showImages={showImages}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <FooterStrip>
        <p className="text-[#64748b]">
          {footer.text}{" "}
          {footer.link && (
            <Link
              href={footer.link.href}
              onClick={onNavigate}
              className="font-semibold text-[#0b1724] underline-offset-4 transition-colors hover:text-[#0e7490] hover:underline"
            >
              {footer.link.label}
            </Link>
          )}
        </p>
        {footer.whatsappLabel && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group/wa inline-flex items-center gap-2 font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            {footer.whatsappLabel}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/wa:translate-x-0.5" />
          </a>
        )}
      </FooterStrip>
    </div>
  );
}

/** One row in a list menu: the label, and an arrow that slides in on hover. */
function ListLink({
  item,
  pathname,
  onNavigate,
}: {
  item: { label: string; href: string; new_tab?: boolean };
  pathname: string;
  onNavigate: () => void;
}) {
  const current = isCurrent(pathname, item.href);
  return (
    <Link
      href={item.href}
      {...newTabProps(item)}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={`group/item flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150 hover:bg-[#ecfbfd] hover:text-[#0e7490] ${
        current ? "bg-[#ecfbfd] text-[#0e7490]" : "text-[#0b1724]"
      }`}
    >
      {item.label}
      <ArrowIcon className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
    </Link>
  );
}

function ListPanel({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className={`${panelSurface} w-[30rem]`}>
      <ul className="grid grid-cols-2 gap-0.5 p-3">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <ListLink item={item} pathname={pathname} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function IndustriesPanel({
  industries,
  pathname,
  onNavigate,
}: {
  industries: HeaderModel["industries"];
  pathname: string;
  onNavigate: () => void;
}) {
  const { heading, viewAll, groups } = industries;
  const columns = groups.length > 1;
  return (
    <div className={`${panelSurface} ${columns ? "" : "w-[30rem]"}`}>
      {heading && <p className={`${eyebrowClass} px-6 pt-5`}>{heading}</p>}
      <div className={columns ? "grid grid-cols-3 gap-x-2 gap-y-5 p-5" : "p-3"}>
        {groups.map((group) => (
          <div key={group.title} className="min-w-0">
            {columns && <ColumnTitle>{group.title}</ColumnTitle>}
            <ul className={columns ? "space-y-0.5" : "grid grid-cols-2 gap-0.5"}>
              {group.items.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <ListLink item={item} pathname={pathname} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {viewAll && (
        <FooterStrip>
          <Link
            href={viewAll.href}
            onClick={onNavigate}
            className="group/all inline-flex items-center gap-1.5 font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
          >
            {viewAll.label}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
          </Link>
        </FooterStrip>
      )}
    </div>
  );
}

/** The Insights menu's right column: the article pointed at, large. */
function PostPreview({
  post,
  button,
  pictures,
  showImages,
  onRest,
  onNavigate,
}: {
  post: PostCard;
  button: string;
  pictures: { src: string; alt: string }[];
  showImages: boolean;
  /** Resting on the preview keeps the article it shows. */
  onRest: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="hidden min-w-0 flex-col border-l border-[#e2e8f0] p-5 xl:flex" onPointerEnter={onRest}>
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-[#e2e8f0]">
        <PictureStack pictures={pictures} current={post.image} show={showImages} sizes="260px" />
      </div>
      <div key={post.href} className="menu-preview-in flex flex-1 flex-col pt-4">
        {post.category && (
          <span className="self-start rounded-full bg-[rgba(44,205,222,0.12)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#0e7490]">
            {post.category}
          </span>
        )}
        <p className="mt-2 line-clamp-3 text-[15px] font-semibold leading-snug text-[#0b1724]">{post.title}</p>
        <p className="mt-1.5 text-[12px] text-[#64748b]">{[post.date, post.readTime].filter(Boolean).join(" · ")}</p>
        <Link
          href={post.href}
          onClick={onNavigate}
          className="group/read mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-[13.5px] font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
        >
          {button}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/read:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function InsightsPanel({
  insights,
  open,
  showImages,
  onNavigate,
}: {
  insights: HeaderModel["insights"];
  open: boolean;
  /** Thumbnails load once the menu has been opened, not on every page view. */
  showImages: boolean;
  onNavigate: () => void;
}) {
  const { topics, posts, preview, footer } = insights;
  const { picked, pick, cancel } = usePick(open);
  const pickedTopic = topics.find((topic) => `topic:${topic.label}` === picked);
  // A topic shows its newest article; with nothing pointed at, the newest of all.
  const previewed = preview
    ? (pickedTopic?.latest ?? posts.find((post) => `post:${post.href}` === picked) ?? posts[0] ?? null)
    : null;
  const pictures = uniquePictures([...posts, ...topics.flatMap((topic) => (topic.latest ? [topic.latest] : []))].map((post) => ({ src: post.image, alt: post.alt })));
  const pickFor = (key: string) => (previewed ? pick(key) : {});
  return (
    <div className={panelSurface}>
      <div
        className={`grid ${
          topics.length
            ? `lg:grid-cols-[270px_minmax(0,1fr)] ${previewed ? "xl:grid-cols-[250px_250px_minmax(0,1fr)_300px]" : "xl:grid-cols-[250px_270px_minmax(0,1fr)]"}`
            : previewed
              ? "xl:grid-cols-[250px_minmax(0,1fr)_300px]"
              : "xl:grid-cols-[250px_minmax(0,1fr)]"
        }`}
      >
        <IntroZone
          eyebrow={insights.eyebrow}
          heading={insights.heading}
          text={insights.text}
          link={insights.viewAll}
          outward
          onNavigate={onNavigate}
        />

        {topics.length > 0 && (
          <div className="border-r border-[#e2e8f0] p-5">
            <ColumnTitle>Topics</ColumnTitle>
            <ul className="space-y-0.5">
              {topics.map((topic) => (
                <li key={topic.label}>
                  <Link
                    href={topic.href}
                    onClick={onNavigate}
                    {...pickFor(`topic:${topic.label}`)}
                    className={`group/topic flex items-center gap-2 rounded-xl px-2 py-2 text-[13.5px] font-medium leading-snug transition-colors duration-150 hover:bg-[#ecfbfd] hover:text-[#0e7490] ${
                      pickedTopic === topic ? "bg-[#ecfbfd] text-[#0e7490]" : "text-[#0b1724]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">{topic.label}</span>
                    <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11.5px] font-semibold tabular-nums text-[#64748b]">
                      {topic.count}
                    </span>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-[#94a3b8] transition-colors group-hover/topic:text-[#0e7490]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="min-w-0 p-5">
          <ColumnTitle>Latest articles</ColumnTitle>
          {posts.length ? (
            <ul className="space-y-1">
              {posts.map((post) => (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    onClick={onNavigate}
                    {...pickFor(`post:${post.href}`)}
                    className={`group/post flex items-start gap-3.5 rounded-xl p-2 transition-colors duration-150 hover:bg-[#ecfbfd] ${
                      picked === `post:${post.href}` ? "bg-[#ecfbfd]" : ""
                    }`}
                  >
                    {/* Fixed size whether or not the image has loaded, so nothing shifts. */}
                    <span className="relative block h-[60px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-[#e2e8f0]">
                      {showImages && post.image && (
                        <Image
                          src={post.image}
                          alt={post.alt}
                          width={84}
                          height={60}
                          sizes="84px"
                          loading="lazy"
                          unoptimized={!post.image.startsWith("/")}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      {post.category && (
                        <span className="inline-block rounded-full bg-[rgba(44,205,222,0.12)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#0e7490]">
                          {post.category}
                        </span>
                      )}
                      <span className="mt-1 line-clamp-2 block text-[13.5px] font-semibold leading-snug text-[#0b1724] group-hover/post:text-[#0e7490]">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-[12px] text-[#64748b]">
                        {[post.date, post.readTime].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-3 text-[13.5px]">
              <Link href={insights.viewAll.href} onClick={onNavigate} className="font-semibold text-[#0b1724] hover:text-[#0e7490]">
                {insights.viewAll.label}
              </Link>
            </p>
          )}
        </div>

        {previewed && preview && (
          <PostPreview
            post={previewed}
            button={preview.button}
            pictures={pictures}
            showImages={showImages}
            onRest={cancel}
            onNavigate={onNavigate}
          />
        )}
      </div>

      <FooterStrip>
        <p className="text-[#64748b]">{footer.text}</p>
        <Link
          href={footer.link.href}
          onClick={onNavigate}
          className="group/blog inline-flex items-center gap-2 font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
        >
          {footer.link.label}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/blog:translate-x-0.5" />
        </Link>
      </FooterStrip>
    </div>
  );
}

/**
 * A top-level button and its panel. The mega menu is positioned against the
 * whole bar (its wrapper is left static), a list panel against its button.
 * The panel follows the button in the page, so Tab walks straight into it.
 */
function Dropdown({
  id,
  label,
  active,
  open,
  wide,
  hover,
  onToggle,
  onKeyboardFocus,
  onLeave,
  children,
}: {
  id: string;
  label: string;
  active: boolean;
  open: boolean;
  wide: boolean;
  hover: {
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
  };
  onToggle: (pointerType: string) => void;
  onKeyboardFocus: () => void;
  onLeave: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={wide ? "flex" : "relative flex"}
      {...hover}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        // Keyboard focus moving on past the panel closes it. Clicks outside
        // are handled by the header's pointerdown listener.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) onLeave();
      }}
    >
      <button
        id={`${id}-button`}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        // A keyboard "click" reports no pointer type.
        onClick={(event) => onToggle((event.nativeEvent as globalThis.PointerEvent).pointerType ?? "")}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) onKeyboardFocus();
        }}
        className={pillClass(active || open)}
      >
        {label}
        <ChevronIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={`${id}-panel`}
        inert={!open}
        className={`absolute top-full z-10 transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none ${
          wide ? "inset-x-0 pt-2.5" : "left-1/2 -translate-x-1/2 pt-[27px]"
        } ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

// ── Mobile ─────────────────────────────────────────────────────────────────

const mobileRowClass =
  "flex w-full items-center justify-between gap-4 py-4 text-left font-display text-[21px] font-semibold tracking-[-0.02em] text-white";

function MobileAccordion({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={mobileRowClass}
      >
        {label}
        <ChevronIcon
          className={`h-5 w-5 shrink-0 text-[#2CCDDE] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </li>
  );
}

const mobileGroupTitleClass = "px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]";

/** The "view all" link under a mobile accordion's list. */
function MobileMore({ link, onNavigate }: { link: MenuLink; onNavigate: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="mt-3 inline-flex items-center gap-1.5 px-2 text-[14px] font-semibold text-[#2CCDDE]"
    >
      {link.label}
      <ArrowIcon className="h-3.5 w-3.5" />
    </Link>
  );
}

const mobileSubLinkClass =
  "flex items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] text-[#e2e8f0] transition-colors hover:bg-white/[0.06] hover:text-white";

// ── Header ─────────────────────────────────────────────────────────────────

export default function Header({
  model = fallbackHeader(),
  logoUrl = "/images/logo.png",
  phone = DEFAULT_PHONE,
  whatsappUrl,
}: {
  /** Built on the server by getHeaderModel(), so every link is in the HTML. */
  model?: HeaderModel;
  logoUrl?: string;
  phone?: string;
  whatsappUrl?: string;
}) {
  const { nav: entries, services, industries, insights, cta } = model;
  const whatsapp = whatsappUrl || `https://wa.me/${phone.replace(/\D/g, "")}`;
  const pathname = usePathname();
  const baseId = useId();
  const navRef = useRef<HTMLElement>(null);

  // ── Desktop dropdowns: one open at a time.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  // A menu opened by hover or keyboard focus stays open on the click (or
  // Enter) that usually follows, rather than toggling shut again.
  const openedWithoutClick = useRef(false);
  // Escape hands focus back to the menu's button; that focus must not reopen it.
  const skipFocusOpen = useRef(false);
  const closeMenu = () => {
    clearTimeout(timer.current);
    setOpenMenu(null);
  };
  // Menus opened so far: their pictures load from then on.
  const [seen, setSeen] = useState<string[]>([]);
  if (openMenu && !seen.includes(openMenu)) setSeen([...seen, openMenu]);
  const later = (next: string | null, delay: number) => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenMenu(next), delay);
  };
  const hoverFor = (key: string) => ({
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (openMenu === key) return clearTimeout(timer.current);
      openedWithoutClick.current = true;
      // Moving from one open menu to the next swaps at once.
      later(key, openMenu ? 0 : HOVER_DELAY);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      openedWithoutClick.current = false;
      later(null, HOVER_DELAY);
    },
  });
  const toggleFor = (key: string) => (pointerType: string) => {
    clearTimeout(timer.current);
    // With a mouse the menu is already open (or about to be) from hovering,
    // so a click confirms it rather than toggling it shut. Moving away,
    // clicking elsewhere or Escape closes it. Touch and keyboard still toggle.
    if (pointerType === "mouse") {
      openedWithoutClick.current = false;
      setOpenMenu(key);
      return;
    }
    if (openedWithoutClick.current) {
      openedWithoutClick.current = false;
      setOpenMenu(key);
      return;
    }
    setOpenMenu((value) => (value === key ? null : key));
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(event: globalThis.PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const button = document.getElementById(`${baseId}-${openMenu}-button`);
      const hadFocus = Boolean(button?.parentElement?.contains(document.activeElement));
      setOpenMenu(null);
      // Back to the menu's button, without that focus reopening it.
      if (hadFocus && button) {
        skipFocusOpen.current = true;
        button.focus();
        skipFocusOpen.current = false;
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu, baseId]);

  // ── Mobile menu.
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  // Any navigation — a menu link, the logo, the browser's back button —
  // lands on a new page with every menu closed.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = matchMedia("(min-width: 1024px)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    // Widening the window past the breakpoint hides the menu button, so
    // close the menu rather than leave the page locked behind it.
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [mobileOpen]);

  const inGroups = (groups: { items: { href: string }[] }[]) =>
    groups.some((group) => group.items.some((item) => isCurrent(pathname, item.href)));
  const activeFor = (entry: Exclude<(typeof entries)[number], { kind: "link" }>) => {
    if (entry.kind === "services") return inGroups(services.groups);
    if (entry.kind === "industries") return inGroups(industries.groups);
    if (entry.kind === "insights")
      return isCurrent(pathname, entry.href) || insights.posts.some((post) => isCurrent(pathname, post.href));
    return entry.items.some((item) => isCurrent(pathname, item.href));
  };

  return (
    <>
      {/* The bar floats: the header itself is a transparent strip that
          holds the page's top spacing, and only the bar takes clicks.
          The strip is the hero's wider container (hero-container) and the bar
          fills it exactly, padded by --panel-px like the hero panel, so the
          two share their edges and the logo lines up with the hero heading. */}
      <header className="site-header hero-container pointer-events-none sticky top-0 z-[65] pt-3 lg:pt-4">
        {/* site-bar* classes are hooks only: the home page (home.css) turns
            the bar light to match its hero. Elsewhere they change nothing. */}
        <div className="site-bar panel-px pointer-events-auto relative isolate flex h-16 items-center gap-1.5 rounded-[20px] sm:gap-2 lg:h-[72px]">
          {/* The frosted backing lives on its own layer, so the blur never
              becomes the containing block of anything inside the bar. */}
          <span
            aria-hidden="true"
            className="site-bar-bg absolute inset-0 -z-10 rounded-[20px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(19,33,47,0.97),rgba(15,27,39,0.97))] shadow-[0_12px_40px_rgba(4,13,18,0.35)] backdrop-blur-[10px]"
          />

          <LogoLink
            src={logoUrl}
            // Its largest size (lg:h-9, 28 x 36), so phones are not sent a
            // logo twice as big as they show; the same shape as the file.
            width={28}
            height={36}
            className="flex shrink-0 items-center gap-2.5"
            imageClassName="h-7 w-auto object-contain sm:h-8 lg:h-9"
            preload
          >
            <span className="site-bar-brand font-brand text-[17px] font-extrabold uppercase leading-none tracking-[-0.01em] text-white sm:text-[19px] lg:text-xl">
              Byteflo<span className="brand-accent">w</span>
            </span>
          </LogoLink>

          <span aria-hidden="true" className="flex-1" />

          <nav ref={navRef} aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {entries.map((entry) => {
              if (entry.kind === "link") {
                const current = isCurrent(pathname, entry.item.href);
                return (
                  <Link
                    key={entry.key}
                    href={entry.item.href}
                    {...newTabProps(entry.item)}
                    aria-current={current ? "page" : undefined}
                    className={pillClass(current)}
                  >
                    {entry.item.label}
                  </Link>
                );
              }
              const id = `${baseId}-${entry.key}`;
              const open = openMenu === entry.key;
              return (
                <Dropdown
                  key={entry.key}
                  id={id}
                  label={entry.label}
                  active={activeFor(entry)}
                  open={open}
                  wide={
                    entry.kind === "services" ||
                    entry.kind === "insights" ||
                    (entry.kind === "industries" && industries.groups.length > 1)
                  }
                  hover={hoverFor(entry.key)}
                  onToggle={toggleFor(entry.key)}
                  onKeyboardFocus={() => {
                    if (skipFocusOpen.current) return;
                    clearTimeout(timer.current);
                    openedWithoutClick.current = true;
                    setOpenMenu(entry.key);
                  }}
                  onLeave={() => {
                    if (open) closeMenu();
                  }}
                >
                  {entry.kind === "services" ? (
                    <ServicesPanel
                      services={services}
                      whatsapp={whatsapp}
                      open={open}
                      showImages={seen.includes(entry.key)}
                      onNavigate={closeMenu}
                    />
                  ) : entry.kind === "insights" ? (
                    <InsightsPanel insights={insights} open={open} showImages={seen.includes(entry.key)} onNavigate={closeMenu} />
                  ) : entry.kind === "industries" ? (
                    <IndustriesPanel industries={industries} pathname={pathname} onNavigate={closeMenu} />
                  ) : (
                    <ListPanel items={entry.items} pathname={pathname} onNavigate={closeMenu} />
                  )}
                </Dropdown>
              );
            })}
          </nav>

          {model.showPhone && (
            <>
              <span aria-hidden="true" className="site-bar-divider mx-3 hidden h-6 w-px bg-white/15 xl:block" />
              <a
                href={telHref(phone)}
                className="site-bar-phone hidden items-center gap-2 whitespace-nowrap text-[13.5px] tabular-nums text-[#cbd5e1] transition-colors duration-200 hover:text-white xl:inline-flex"
              >
                <PhoneIcon className="h-4 w-4 text-[#2CCDDE]" />
                {phone}
              </a>
            </>
          )}

          <Link
            href={cta.href}
            className="site-bar-cta group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#2CCDDE] pl-3.5 pr-1 text-[13px] sm:ml-1 sm:gap-2 sm:pl-4 font-bold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9] lg:ml-3 lg:h-12 lg:gap-3 lg:pl-5 lg:pr-1.5 lg:text-[14.5px] xl:ml-5"
          >
            <span className="lg:hidden">{cta.shortLabel}</span>
            <span className="hidden lg:inline">{cta.label}</span>
            <span className="site-bar-cta-arrow grid h-7 w-7 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE] sm:h-8 sm:w-8">
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="site-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="site-bar-burger grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:bg-white/[0.08] sm:h-10 sm:w-10 lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-[18px]">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ${
                  mobileOpen ? "translate-y-[5.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ${
                  mobileOpen ? "-translate-y-[5.25px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen, under the floating bar (which keeps its close button)
          but above the floating WhatsApp/call buttons and the Inquiry tab. */}
      <div
        id="site-menu"
        inert={!mobileOpen}
        className={`site-menu fixed inset-0 z-[62] overflow-y-auto overscroll-contain bg-[#0b1622] transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Main" className="mx-auto flex min-h-full max-w-xl flex-col px-5 pb-8 pt-[92px] sm:px-6">
          <ul className="divide-y divide-white/10 border-b border-white/10">
            {entries.map((entry) => {
              if (entry.kind === "services")
                return (
                  <MobileAccordion key={entry.key} label={entry.label}>
                    {services.groups.map((group) => (
                      <div key={group.title} className="pt-2">
                        <p className={mobileGroupTitleClass}>{group.title}</p>
                        <ul>
                          {group.items.map((item) => (
                            <li key={`${item.label}-${item.href}`}>
                              <Link
                                href={item.href}
                                onClick={closeMobile}
                                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                                className={mobileSubLinkClass}
                              >
                                <span
                                  aria-hidden="true"
                                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(44,205,222,0.12)] text-[#2CCDDE]"
                                >
                                  <ServiceIcon link={item.href} className="h-4 w-4" />
                                </span>
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <MobileMore link={services.intro.link} onNavigate={closeMobile} />
                  </MobileAccordion>
                );
              if (entry.kind === "industries")
                return (
                  <MobileAccordion key={entry.key} label={entry.label}>
                    {industries.groups.map((group) => (
                      <div key={group.title} className="pt-2">
                        {group.title && <p className={mobileGroupTitleClass}>{group.title}</p>}
                        <ul className="grid gap-0.5 sm:grid-cols-2">
                          {group.items.map((item) => (
                            <li key={`${item.label}-${item.href}`}>
                              <Link
                                href={item.href}
                                onClick={closeMobile}
                                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                                className={mobileSubLinkClass}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {industries.viewAll && <MobileMore link={industries.viewAll} onNavigate={closeMobile} />}
                  </MobileAccordion>
                );
              if (entry.kind === "insights")
                return (
                  <MobileAccordion key={entry.key} label={entry.label}>
                    {insights.posts.length > 0 && (
                      <div className="pt-2">
                        <p className={mobileGroupTitleClass}>Latest articles</p>
                        <ul>
                          {insights.posts.map((post) => (
                            <li key={post.href}>
                              <Link
                                href={post.href}
                                onClick={closeMobile}
                                aria-current={isCurrent(pathname, post.href) ? "page" : undefined}
                                className="block rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.06]"
                              >
                                <span className="line-clamp-2 block text-[15px] leading-snug text-[#e2e8f0]">{post.title}</span>
                                <span className="mt-1 block text-[12.5px] text-[#94a3b8]">
                                  {[post.category, post.date].filter(Boolean).join(" · ")}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {insights.topics.length > 0 && (
                      <div className="pt-3">
                        <p className={mobileGroupTitleClass}>Topics</p>
                        <ul className="flex flex-wrap gap-2 px-2 pt-1">
                          {insights.topics.map((topic) => (
                            <li key={topic.label}>
                              <Link
                                href={topic.href}
                                onClick={closeMobile}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[13px] text-[#e2e8f0]"
                              >
                                {topic.label}
                                <span className="tabular-nums text-[#94a3b8]">{topic.count}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <MobileMore link={insights.viewAll} onNavigate={closeMobile} />
                  </MobileAccordion>
                );
              if (entry.kind === "list")
                return (
                  <MobileAccordion key={entry.key} label={entry.label}>
                    <ul className="grid gap-0.5 sm:grid-cols-2">
                      {entry.items.map((item) => (
                        <li key={`${item.label}-${item.href}`}>
                          <Link
                            href={item.href}
                            {...newTabProps(item)}
                            onClick={closeMobile}
                            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                            className={mobileSubLinkClass}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </MobileAccordion>
                );
              const current = isCurrent(pathname, entry.item.href);
              return (
                <li key={entry.key}>
                  <Link
                    href={entry.item.href}
                    {...newTabProps(entry.item)}
                    onClick={closeMobile}
                    aria-current={current ? "page" : undefined}
                    className={mobileRowClass}
                  >
                    {entry.item.label}
                    {current ? (
                      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#2CCDDE]" />
                    ) : (
                      <ArrowIcon className="h-4 w-4 shrink-0 text-[#64748b]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto space-y-3 pt-10">
            <div className="grid grid-cols-2 gap-3">
              <a
                href={telHref(phone)}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 text-[14px] font-semibold text-white"
              >
                <PhoneIcon className="h-4 w-4 text-[#2CCDDE]" />
                Call
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 text-[14px] font-semibold text-white"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                WhatsApp
              </a>
            </div>
            <Link
              href={cta.href}
              onClick={closeMobile}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] text-[15px] font-bold text-[#04121A]"
            >
              {cta.label}
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
            <p className="pt-1 text-center text-[13px] tabular-nums text-[#94a3b8]">{phone}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
