"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

type LogoLinkProps = {
  src: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

/**
 * The logo always returns you to the top of the home page. Clicking it while
 * already on "/" is a no-op navigation for the router, so scroll there
 * ourselves instead of leaving the viewport where it was.
 */
export default function LogoLink({
  src,
  width,
  height,
  className,
  imageClassName,
  priority,
}: LogoLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    // Let modified clicks (new tab, etc.) behave normally.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <Link href="/" onClick={handleClick} aria-label="Byteflow — back to top" className={className}>
      <Image
        src={src}
        alt="Byteflow"
        width={width}
        height={height}
        className={imageClassName}
        priority={priority}
      />
    </Link>
  );
}
