"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

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

function DesktopItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [open, setOpen] = useState(false),
    hasChildren = Boolean(item.children?.length);
  if (!hasChildren)
    return (
      <Link
        href={item.href}
        target={item.new_tab ? "_blank" : undefined}
        rel={item.new_tab ? "noopener noreferrer" : undefined}
        className={`${depth ? "flex w-full items-center px-4 py-3 text-[13px]" : "text-sm"} whitespace-nowrap font-medium text-[var(--text-nav)] transition-colors hover:text-[#2CCDDE]`}
      >
        {item.label}
      </Link>
    );
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${depth ? "flex w-full px-5 py-3 text-[13px]" : "inline-flex text-sm"} items-center gap-1.5 whitespace-nowrap font-medium text-[var(--text-nav)] transition-colors hover:text-[#2CCDDE]`}
      >
        {item.label}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${depth ? "-rotate-90" : open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute z-50 w-72 overflow-visible rounded-xl border py-1 ${depth ? "left-full top-0 ml-1" : "left-0 top-full mt-4"}`}
          style={{
            background: "var(--bg-page)",
            borderColor: "#2CCDDE30",
            boxShadow: "0 20px 40px rgba(0,0,0,.7)",
          }}
        >
          {!depth && (
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-[#2CCDDE] to-[#46A3E1]" />
          )}
          {item.children!.map((child) => (
            <DesktopItem
              key={`${child.label}-${child.href}`}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileItem({
  item,
  close,
  depth = 0,
}: {
  item: NavItem;
  close: () => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(false),
    hasChildren = Boolean(item.children?.length);
  return (
    <div style={{ paddingLeft: depth * 16 }}>
      {hasChildren ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between border-b border-[var(--border-subtle)] py-3 text-left text-sm font-semibold text-[var(--text-nav)]"
          >
            <span>{item.label}</span>
            <span className="text-[#2CCDDE]">{open ? "−" : "+"}</span>
          </button>
          {open && (
            <div>
              {item.children!.map((child) => (
                <MobileItem
                  key={`${child.label}-${child.href}`}
                  item={child}
                  close={close}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href}
          target={item.new_tab ? "_blank" : undefined}
          onClick={close}
          className="block border-b border-[var(--border-subtle)] py-3 text-sm text-[var(--text-quiet)] hover:text-[#2CCDDE]"
        >
          {item.label}
        </Link>
      )}
    </div>
  );
}

export default function Header({
  navigation = fallbackNav,
  serviceLinks,
  logoUrl = "/images/logo.png",
}: {
  navigation?: NavItem[];
  serviceLinks?: NavItem[];
  logoUrl?: string;
}) {
  const menu = navigation.some((item) => item.children?.length)
    ? navigation
    : serviceLinks?.length
      ? [
          ...navigation.slice(0, 2),
          { label: "Services", href: "#", children: serviceLinks },
          ...navigation.slice(2),
        ]
      : navigation;
  const [scrolled, setScrolled] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 20);
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--header-scrolled-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(44,205,222,.12)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-8">
          <Link href="/" className="shrink-0">
            <Image
              src={logoUrl}
              alt="Byteflow"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
            {menu.map((item) => (
              <DesktopItem key={`${item.label}-${item.href}`} item={item} />
            ))}
          </nav>
          <ThemeToggle />
          <Link
            href="/contact-us"
            className="hidden shrink-0 rounded-full bg-gradient-to-r from-[#2CCDDE] to-[#46A3E1] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.04] lg:inline-flex"
          >
            Contact Us
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/20 bg-cyan-400/[.08] text-cyan-400 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden bg-[var(--bg-page)] transition-all duration-300 lg:hidden ${mobileOpen ? "max-h-[calc(100vh-76px)] border-t border-cyan-400/10" : "max-h-0"}`}
      >
        <nav className="mx-auto max-h-[calc(100vh-76px)] max-w-7xl overflow-y-auto px-4 py-5">
          {menu.map((item) => (
            <MobileItem
              key={`${item.label}-${item.href}`}
              item={item}
              close={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
