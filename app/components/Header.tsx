"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LogoLink from "./LogoLink";
import { ArrowIcon, ChevronIcon, PhoneIcon, WhatsAppIcon } from "./InlineIcons";

export type NavItem = {
  label: string;
  href: string;
  new_tab?: boolean;
  children?: NavItem[];
};
const fallbackServices = [
  { label: "IT AMC / IT Support", href: "/it-amc-services-dubai" },
  { label: "Cyber Security", href: "/cyber-security" },
  { label: "System Integration", href: "/system-integration" },
  { label: "Cloud Services", href: "/cloud-services-dubai" },
];
const fallbackNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "#", children: fallbackServices },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
];

const CONTACT_HREF = "/contact-us";
const DEFAULT_PHONE = "+971 54 328 2042";

// Scroll position as an external store, so the header reads it while
// rendering rather than copying it into state from an effect. The server
// always renders the un-scrolled bar.
function subscribeToScroll(onChange: () => void) {
  addEventListener("scroll", onChange, { passive: true });
  return () => removeEventListener("scroll", onChange);
}
const readScrolled = () => scrollY > 8;
const readScrolledOnServer = () => false;

/** True when `href` is the page being viewed, or a section containing it. */
function isCurrent(pathname: string, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/)[0] || "/";
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function containsCurrent(pathname: string, item: NavItem): boolean {
  return (
    isCurrent(pathname, item.href) ||
    Boolean(item.children?.some((child) => containsCurrent(pathname, child)))
  );
}

const countLinks = (items: NavItem[]): number =>
  items.reduce(
    (total, item) =>
      total + (item.children?.length ? countLinks(item.children) : 1),
    0,
  );

// "#" is how the CMS marks a menu entry that only groups others.
const hasPage = (href: string) => Boolean(href) && href !== "#";

const newTabProps = (item: NavItem) =>
  item.new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {};

const keyOf = (item: NavItem) => `${item.label}-${item.href}`;

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

// ── Desktop ────────────────────────────────────────────────────────────────

/** Top-level items run the full height of the bar so the marker can sit on its bottom edge. */
const topLevelClass = (highlighted: boolean) =>
  `nav-item group relative flex h-full items-center gap-1 px-3 text-[14.5px] font-medium transition-colors duration-200 ${
    highlighted
      ? "text-[var(--text-primary)]"
      : "text-[var(--text-nav)] hover:text-[var(--text-primary)]"
  }`;

/** Brand-colour bar under the current section; a neutral one draws in on hover. */
function Marker({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-3 bottom-0 h-[2px] origin-left rounded-full transition-transform duration-300 ease-out ${
        active
          ? "scale-x-100 bg-[#2CCDDE]"
          : "scale-x-0 bg-[var(--border-strong)] group-hover:scale-x-100"
      }`}
    />
  );
}

function DesktopLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const current = isCurrent(pathname, item.href);
  return (
    <Link
      href={item.href}
      {...newTabProps(item)}
      aria-current={current ? "page" : undefined}
      className={topLevelClass(current)}
    >
      {item.label}
      <Marker active={current} />
    </Link>
  );
}

function PanelEntries({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      {items.map((item) => {
        if (item.children?.length) {
          const heading =
            "block px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-nav)]";
          return (
            <div key={keyOf(item)} className="pb-1">
              {hasPage(item.href) ? (
                <Link
                  href={item.href}
                  {...newTabProps(item)}
                  onClick={onNavigate}
                  className={`${heading} transition-colors hover:text-[var(--text-primary)]`}
                >
                  {item.label}
                </Link>
              ) : (
                <p className={heading}>{item.label}</p>
              )}
              <PanelEntries
                items={item.children}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            </div>
          );
        }
        const current = isCurrent(pathname, item.href);
        return (
          <Link
            key={keyOf(item)}
            href={item.href}
            {...newTabProps(item)}
            onClick={onNavigate}
            aria-current={current ? "page" : undefined}
            className={`group/link flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors duration-150 ${
              current
                ? "bg-[var(--overlay-hover)] font-medium text-[var(--text-primary)]"
                : "text-[var(--text-body)] hover:bg-[var(--overlay-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span>{item.label}</span>
            <ArrowIcon className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
          </Link>
        );
      })}
    </>
  );
}

function DesktopDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  // A mouse opens the panel on hover; the click that usually follows should
  // keep it open rather than toggle it shut again.
  const openedByHover = useRef(false);
  const panelId = useId();
  const children = item.children ?? [];
  const current = containsCurrent(pathname, item);
  const wide = countLinks(children) > 6;
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-full items-center"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        clearTimeout(closeTimer.current);
        openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        openedByHover.current = false;
        // A short grace period, so cutting a corner on the way to the panel
        // does not slam it shut.
        clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(close, 150);
      }}
      onBlur={(event) => {
        // Keyboard focus moving on to something outside the menu closes it.
        // Clicks outside are handled by the pointerdown listener above.
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
            return;
          }
          setOpen((value) => !value);
        }}
        className={topLevelClass(current || open)}
      >
        {item.label}
        <ChevronIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <Marker active={current} />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={`absolute -left-1 top-full z-10 pt-1.5 transition-[opacity,translate,visibility] duration-200 ease-out ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div
          className={`overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-page)] shadow-(--shadow-pop) ${
            wide ? "w-[34rem]" : "w-[20rem]"
          }`}
        >
          {hasPage(item.href) && (
            <Link
              href={item.href}
              {...newTabProps(item)}
              onClick={close}
              className="group/all flex items-center justify-between border-b border-[var(--border-default)] px-5 py-3 text-[13px] font-semibold text-[var(--text-primary)]"
            >
              All {item.label.toLowerCase()}
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
            </Link>
          )}
          <div className={`p-2 ${wide ? "grid grid-cols-2 gap-x-1" : "flex flex-col"}`}>
            <PanelEntries items={children} pathname={pathname} onNavigate={close} />
          </div>
          <Link
            href={CONTACT_HREF}
            onClick={close}
            className="group/cta flex items-center justify-between gap-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3.5"
          >
            <span>
              <span className="block text-[12.5px] text-[var(--text-nav)]">Not sure which one fits?</span>
              <span className="block text-[13.5px] font-semibold text-[var(--text-primary)]">Ask an engineer</span>
            </span>
            <ArrowIcon className="h-4 w-4 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover/cta:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Mobile ─────────────────────────────────────────────────────────────────

function MobileSubEntries({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      {items.map((item) => {
        if (item.children?.length)
          return (
            <li key={keyOf(item)}>
              <p className="pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-nav)]">
                {item.label}
              </p>
              <ul>
                <MobileSubEntries
                  items={item.children}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </ul>
            </li>
          );
        const current = isCurrent(pathname, item.href);
        return (
          <li key={keyOf(item)}>
            <Link
              href={item.href}
              {...newTabProps(item)}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={`flex items-center justify-between gap-3 py-2.5 text-[15px] ${
                current
                  ? "font-medium text-[var(--text-primary)]"
                  : "text-[var(--text-body)]"
              }`}
            >
              {item.label}
              {current && (
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CCDDE]" />
              )}
            </Link>
          </li>
        );
      })}
    </>
  );
}

function MobileEntry({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  // A group holding the page being viewed starts expanded.
  const [open, setOpen] = useState(() => containsCurrent(pathname, item));
  const panelId = useId();
  const rowClass =
    "flex w-full items-center justify-between gap-4 py-4 text-left font-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]";

  if (!item.children?.length) {
    const current = isCurrent(pathname, item.href);
    return (
      <li>
        <Link
          href={item.href}
          {...newTabProps(item)}
          onClick={onNavigate}
          aria-current={current ? "page" : undefined}
          className={rowClass}
        >
          {item.label}
          {current ? (
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#2CCDDE]" />
          ) : (
            <ArrowIcon className="h-4 w-4 shrink-0 text-[var(--text-dim)]" />
          )}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={rowClass}
      >
        {item.label}
        <span
          aria-hidden="true"
          className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--border-default)] text-[var(--text-nav)]"
        >
          <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
          <span
            className={`absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-300 ${open ? "scale-y-0" : ""}`}
          />
        </span>
      </button>
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <ul className="mb-4 ml-1 border-l border-[var(--border-default)] pl-4">
            {hasPage(item.href) && (
              <li>
                <Link
                  href={item.href}
                  {...newTabProps(item)}
                  onClick={onNavigate}
                  className="block py-2.5 text-[15px] font-medium text-[var(--text-primary)]"
                >
                  All {item.label.toLowerCase()}
                </Link>
              </li>
            )}
            <MobileSubEntries
              items={item.children}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </ul>
        </div>
      </div>
    </li>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────

export default function Header({
  navigation = fallbackNav,
  serviceLinks,
  logoUrl = "/images/logo.png",
  phone = DEFAULT_PHONE,
  whatsappUrl,
}: {
  navigation?: NavItem[];
  serviceLinks?: NavItem[];
  logoUrl?: string;
  phone?: string;
  whatsappUrl?: string;
}) {
  const withServices = navigation.some((item) => item.children?.length)
    ? navigation
    : serviceLinks?.length
      ? [
          ...navigation.slice(0, 2),
          { label: "Services", href: "#", children: serviceLinks },
          ...navigation.slice(2),
        ]
      : navigation;
  // The Contact button always sits beside the menu, so a menu entry for the
  // same page would only say it twice.
  const menu = withServices.filter((item) => item.href !== CONTACT_HREF);
  const whatsapp = whatsappUrl || `https://wa.me/${phone.replace(/\D/g, "")}`;

  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    readScrolled,
    readScrolledOnServer,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  // Any navigation — a menu link, the logo, the browser's back button —
  // lands on a new page with the mobile menu closed.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMobileOpen(false);
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

  const solid = scrolled || mobileOpen;

  return (
    <>
      <header
        className={`site-header sticky top-0 z-50 border-b transition-colors duration-300 ${
          solid ? "border-[var(--border-default)]" : "border-transparent"
        }`}
      >
        {/* The frosted backing lives on its own layer: a backdrop-filter on
            the header itself would trap the fixed-position mobile menu. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-300 ${
            solid ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: mobileOpen ? "var(--bg-page)" : "var(--header-scrolled-bg)",
          }}
        />

        <div className="mx-auto flex h-16 max-w-page items-center gap-4 px-4 sm:px-6 lg:h-[72px] lg:gap-6 lg:px-8 xl:gap-10">
          <LogoLink
            src={logoUrl}
            width={56}
            height={72}
            className="flex shrink-0 items-center gap-2.5"
            imageClassName="h-8 w-auto object-contain lg:h-9"
            preload
          >
            <span className="font-brand text-[19px] font-extrabold uppercase leading-none tracking-[-0.01em] text-[var(--text-primary)] lg:text-xl">
              Byteflo<span className="brand-accent">w</span>
            </span>
          </LogoLink>

          <nav aria-label="Main" className="hidden h-full items-stretch lg:flex">
            {menu.map((item) =>
              item.children?.length ? (
                <DesktopDropdown key={keyOf(item)} item={item} pathname={pathname} />
              ) : (
                <DesktopLink key={keyOf(item)} item={item} pathname={pathname} />
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href={telHref(phone)}
              className="hidden items-center gap-2 text-[14px] font-medium tabular-nums text-[var(--text-nav)] transition-colors duration-200 hover:text-[var(--text-primary)] xl:inline-flex"
            >
              <PhoneIcon className="h-4 w-4" />
              {phone}
            </a>
            <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-[var(--border-default)] xl:block" />
            <ThemeToggle />
            <Link
              href={CONTACT_HREF}
              className="group hidden h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#2CCDDE] pl-5 pr-4 text-[14px] font-semibold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9] lg:inline-flex"
            >
              Contact us
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-controls="site-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-default)] text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--overlay-hover)] lg:hidden"
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
        </div>
      </header>

      <div
        id="site-menu"
        inert={!mobileOpen}
        // Above the floating WhatsApp/call buttons (z-50) and the Inquiry tab
        // (z-60), which would otherwise sit on top of the menu's own buttons.
        // It starts below the bar, so it never covers the header itself.
        className={`site-menu fixed inset-x-0 bottom-0 top-16 z-[70] bg-[var(--bg-page)] transition-[opacity,translate,visibility] duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-full max-w-page flex-col overflow-y-auto px-4 pb-8 pt-2 sm:px-6"
        >
          <ul className="divide-y divide-[var(--border-default)] border-b border-[var(--border-default)]">
            {menu.map((item) => (
              <MobileEntry
                key={keyOf(item)}
                item={item}
                pathname={pathname}
                onNavigate={closeMobile}
              />
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-10">
            <Link
              href={CONTACT_HREF}
              onClick={closeMobile}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] text-[15px] font-semibold text-[#04121A]"
            >
              Contact us
              <ArrowIcon className="h-4 w-4" />
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={telHref(phone)}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] text-[14px] font-semibold text-[var(--text-primary)]"
              >
                <PhoneIcon className="h-4 w-4" />
                Call
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] text-[14px] font-semibold text-[var(--text-primary)]"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                WhatsApp
              </a>
            </div>
            <p className="pt-1 text-center text-[13px] tabular-nums text-[var(--text-nav)]">{phone}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
