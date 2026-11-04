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
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoLink from "./LogoLink";
import { ArrowIcon, ArrowUpRightIcon, ChevronIcon, PhoneIcon, WhatsAppIcon } from "./InlineIcons";
import { ServiceIcon } from "./ServiceIcon";
import { defaultHeaderBar, safeLink, type HeaderBar } from "../lib/header-bar";
import { mergeHomeBlock, type HomeBlock } from "../lib/home-content";
import {
  buildNav,
  isCurrent,
  serviceGroups,
  type NavEntry,
  type NavItem,
} from "../lib/header-menu";

export type { NavItem };

const fallbackNav: NavItem[] = [
  { label: "Services", href: "#" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about-us" },
  { label: "Insights", href: "/blog" },
];

const defaultMenu = mergeHomeBlock("header_menu", null);

const DEFAULT_PHONE = "+971 54 328 2042";

// How long the pointer rests on a menu before it opens, and how long it may
// stray off one (cutting a corner on the way to the panel) before it closes.
const HOVER_DELAY = 150;

const newTabProps = (item: { new_tab?: boolean }) =>
  item.new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {};

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Top-level links and dropdown buttons: a cyan pill marks hover, an open menu and the current page. */
const pillClass = (active: boolean) =>
  `inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-[13px] py-[9px] text-[14.5px] font-medium leading-5 transition-colors duration-200 ${
    active
      ? "bg-[rgba(44,205,222,0.12)] text-[#2CCDDE]"
      : "text-[#e2e8f0] hover:bg-[rgba(44,205,222,0.12)] hover:text-[#2CCDDE]"
  }`;

const eyebrowClass = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0e9aa8]";

/** The white panels share one surface. */
const panelSurface =
  "overflow-hidden rounded-[20px] bg-white text-left shadow-[0_32px_80px_-24px_rgba(4,18,26,0.5),0_8px_24px_-8px_rgba(4,18,26,0.18)] ring-1 ring-[rgba(15,23,42,0.06)]";

// ── Desktop panels ─────────────────────────────────────────────────────────

function ServicesPanel({
  menu,
  bar,
  whatsapp,
  onNavigate,
}: {
  menu: HomeBlock;
  bar: HeaderBar;
  whatsapp: string;
  onNavigate: () => void;
}) {
  const f = menu.fields;
  const groups = serviceGroups(menu);
  return (
    <div className={panelSurface}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[250px_minmax(0,1fr)_290px]">
        {/* At 1024px the intro gives its room to the service columns. */}
        <div className="hidden flex-col border-r border-[#e2e8f0] bg-[#f1f6fa] p-7 xl:flex">
          <p className={eyebrowClass}>{f.eyebrow}</p>
          <p className="mt-3 font-display text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0b1724]">
            {f.heading}
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[#64748b]">{f.description}</p>
          <Link
            href={safeLink(f.link, "/#services")}
            onClick={onNavigate}
            className="group/all mt-auto inline-flex items-center gap-1.5 pt-6 text-[13.5px] font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
          >
            {f.link_label}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-5 p-5">
          {groups.map((group) => (
            <div key={group.title} className="min-w-0">
              {/* Two lines tall, so a long group name keeps the rules in line. */}
              <p className="mb-2 flex min-h-[2.75rem] items-end border-b border-[#e2e8f0] px-2 pb-2.5 text-[11px] font-semibold uppercase leading-[1.45] tracking-[0.12em] text-[#94a3b8]">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={`${item.title}-${item.link}`}>
                    <Link
                      href={safeLink(item.link, "/#services")}
                      onClick={onNavigate}
                      className="group/item flex items-start gap-2.5 rounded-xl p-2 transition-colors duration-150 hover:bg-[#ecfbfd]"
                    >
                      <span
                        aria-hidden="true"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(44,205,222,0.12)] text-[#0e7490] transition-colors duration-150 group-hover/item:bg-[#2CCDDE] group-hover/item:text-[#04121A]"
                      >
                        <ServiceIcon link={item.link} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold leading-snug text-[#0b1724]">
                          {item.title}
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

        <div className="p-3 lg:pl-0">
          <div className="relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-[#0b1724] p-6 text-white">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(44,205,222,0.32),transparent_68%)]"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2CCDDE]">
              {f.featured_eyebrow}
            </p>
            <p className="mt-2 font-display text-[22px] font-semibold leading-tight tracking-[-0.02em]">
              {f.featured_title}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {(menu.lists.stats ?? []).slice(0, 2).map((stat) => (
                <p key={stat.title} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3">
                  <span className="block font-display text-[20px] font-semibold leading-none text-[#2CCDDE]">{stat.title}</span>
                  <span className="mt-1.5 block text-[12px] leading-snug text-[#cbd5e1]">{stat.description}</span>
                </p>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <Link
                href={safeLink(f.featured_link, "/it-amc-services-dubai")}
                onClick={onNavigate}
                className="group/plans inline-flex h-10 items-center gap-2.5 rounded-full bg-[#2CCDDE] pl-4 pr-1 text-[13.5px] font-bold text-[#04121A] transition-colors hover:bg-[#5BDCE9]"
              >
                {f.featured_label}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE]">
                  <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/plans:-translate-y-px group-hover/plans:translate-x-px" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-3.5 text-[13.5px]">
        <p className="text-[#64748b]">
          {bar.dropdownNote}{" "}
          <Link
            href={bar.ctaLink}
            onClick={onNavigate}
            className="font-semibold text-[#0b1724] underline-offset-4 transition-colors hover:text-[#0e7490] hover:underline"
          >
            {bar.dropdownCta}
          </Link>
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group/wa inline-flex items-center gap-2 font-semibold text-[#0b1724] transition-colors hover:text-[#0e7490]"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          {f.whatsapp_label}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/wa:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

function ListPanel({
  entry,
  pathname,
  onNavigate,
}: {
  entry: Extract<NavEntry, { kind: "list" }>;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className={`${panelSurface} w-[30rem]`}>
      {entry.heading && <p className={`${eyebrowClass} px-6 pt-5`}>{entry.heading}</p>}
      <ul className="grid grid-cols-2 gap-0.5 p-3">
        {entry.items.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <li key={`${item.label}-${item.href}`}>
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
            </li>
          );
        })}
      </ul>
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
  onToggle: () => void;
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
        onClick={onToggle}
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

const mobileSubLinkClass =
  "flex items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] text-[#e2e8f0] transition-colors hover:bg-white/[0.06] hover:text-white";

// ── Header ─────────────────────────────────────────────────────────────────

export default function Header({
  navigation = fallbackNav,
  logoUrl = "/images/logo.png",
  phone = DEFAULT_PHONE,
  whatsappUrl,
  bar = defaultHeaderBar,
  menu = defaultMenu,
}: {
  navigation?: NavItem[];
  logoUrl?: string;
  phone?: string;
  whatsappUrl?: string;
  bar?: HeaderBar;
  menu?: HomeBlock;
}) {
  const entries = buildNav(navigation, menu, bar.ctaLink);
  const whatsapp = whatsappUrl || `https://wa.me/${phone.replace(/\D/g, "")}`;
  const groups = serviceGroups(menu);
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
  const toggleFor = (key: string) => () => {
    clearTimeout(timer.current);
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

  const servicesCurrent = (menu.lists.services ?? []).some((item) => isCurrent(pathname, item.link));

  return (
    <>
      {/* The bar floats: the header itself is a transparent strip that
          holds the page's top spacing, and only the bar takes clicks. */}
      <header className="site-header pointer-events-none sticky top-0 z-[65] px-3 pt-3 sm:px-4 lg:pt-4">
        <div className="pointer-events-auto relative isolate mx-auto flex h-16 max-w-[1200px] items-center gap-2 rounded-[20px] pl-4 pr-2 lg:h-[72px] lg:pl-6 lg:pr-3">
          {/* The frosted backing lives on its own layer, so the blur never
              becomes the containing block of anything inside the bar. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-[20px] border border-white/[0.08] bg-[rgba(19,33,47,0.92)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-[10px]"
          />

          <LogoLink
            src={logoUrl}
            width={56}
            height={72}
            className="flex shrink-0 items-center gap-2.5"
            imageClassName="h-7 w-auto object-contain sm:h-8 lg:h-9"
            preload
          >
            <span className="font-brand text-[17px] font-extrabold uppercase leading-none tracking-[-0.01em] text-white sm:text-[19px] lg:text-xl">
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
                  active={
                    entry.kind === "services"
                      ? servicesCurrent
                      : entry.items.some((item) => isCurrent(pathname, item.href))
                  }
                  open={open}
                  wide={entry.kind === "services"}
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
                    <ServicesPanel menu={menu} bar={bar} whatsapp={whatsapp} onNavigate={closeMenu} />
                  ) : (
                    <ListPanel entry={entry} pathname={pathname} onNavigate={closeMenu} />
                  )}
                </Dropdown>
              );
            })}
          </nav>

          {bar.showPhone && (
            <>
              <span aria-hidden="true" className="mx-3 hidden h-6 w-px bg-white/15 xl:block" />
              <a
                href={telHref(phone)}
                className="hidden items-center gap-2 whitespace-nowrap text-[13.5px] tabular-nums text-[#cbd5e1] transition-colors duration-200 hover:text-white xl:inline-flex"
              >
                <PhoneIcon className="h-4 w-4 text-[#2CCDDE]" />
                {phone}
              </a>
            </>
          )}

          <Link
            href={bar.ctaLink}
            className="group ml-1 inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#2CCDDE] pl-4 pr-1 text-[13px] font-bold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9] lg:ml-3 lg:h-12 lg:gap-3 lg:pl-5 lg:pr-1.5 lg:text-[14.5px] xl:ml-5"
          >
            <span className="lg:hidden">{bar.ctaShortLabel}</span>
            <span className="hidden lg:inline">{bar.ctaLabel}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE]">
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="site-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:bg-white/[0.08] lg:hidden"
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
                    {groups.map((group) => (
                      <div key={group.title} className="pt-2">
                        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                          {group.title}
                        </p>
                        <ul>
                          {group.items.map((item) => (
                            <li key={`${item.title}-${item.link}`}>
                              <Link
                                href={safeLink(item.link, "/#services")}
                                onClick={closeMobile}
                                aria-current={isCurrent(pathname, item.link) ? "page" : undefined}
                                className={mobileSubLinkClass}
                              >
                                <span
                                  aria-hidden="true"
                                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(44,205,222,0.12)] text-[#2CCDDE]"
                                >
                                  <ServiceIcon link={item.link} className="h-4 w-4" />
                                </span>
                                {item.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link
                      href={safeLink(menu.fields.link, "/#services")}
                      onClick={closeMobile}
                      className="mt-3 inline-flex items-center gap-1.5 px-2 text-[14px] font-semibold text-[#2CCDDE]"
                    >
                      {menu.fields.link_label}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
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
              href={bar.ctaLink}
              onClick={closeMobile}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] text-[15px] font-bold text-[#04121A]"
            >
              {bar.ctaLabel}
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
            <p className="pt-1 text-center text-[13px] tabular-nums text-[#94a3b8]">{phone}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
