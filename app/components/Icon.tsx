import type { CSSProperties } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * A Font Awesome icon as the same <svg> the library's React component draws,
 * classes and all, so the stylesheet in the root layout styles it exactly as
 * before. Drawing it here instead keeps the library's runtime (about 60 KB
 * of JavaScript) out of the browser, and works in server components.
 */
export function Icon({ icon, className = "", style }: { icon: IconDefinition; className?: string; style?: CSSProperties }) {
  const [width, height, , , path] = icon.icon;
  return (
    <svg
      data-prefix={icon.prefix}
      data-icon={icon.iconName}
      className={`svg-inline--fa fa-${icon.iconName} ${className}`.trim()}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={style}
    >
      {(Array.isArray(path) ? path : [path]).map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
}
