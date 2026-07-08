#!/usr/bin/env python3
"""
Audits which previously-indexed byteflow.ae URLs still 404 on the new site.

Source of "indexed pages": the Wayback Machine's CDX API, which lists every
URL under the domain that has ever been crawled/archived. This avoids
scraping Google search results (unreliable, gets blocked, against ToS) while
still giving a real historical list of live URLs search engines found.

Cross-references those URLs against:
  - scripts/parsed-posts.json (the original WordPress post slugs, already
    seeded into Turso under /blog/<slug>)
  - the known static page routes in app/

Anything left over is a URL that was once live and isn't accounted for by
either the blog redirect (app/[slug]/page.tsx) or an existing static route,
and needs manual attention (rename, add a redirect, or accept the 404).
"""

import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
PARSED_POSTS = REPO_ROOT / "scripts" / "parsed-posts.json"
APP_DIR = REPO_ROOT / "app"

CDX_URL = (
    "http://web.archive.org/cdx/search/cdx"
    "?url=byteflow.ae&matchType=domain&output=json"
    "&fl=original&collapse=urlkey&limit=5000"
)

IGNORED_PREFIXES = (
    "wp-admin", "wp-content", "wp-includes", "wp-json", "feed",
    "xmlrpc.php", "sitemap", "category", "tag", "author", "page",
)


def fetch_archived_urls() -> list[str]:
    req = urllib.request.Request(CDX_URL, headers={"User-Agent": "byteflow-slug-audit/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        rows = json.loads(resp.read().decode("utf-8"))
    # First row is the header (["original"]) when results exist
    return [row[0] for row in rows[1:]] if rows else []


def slug_from_url(url: str) -> str | None:
    path = urlparse(url).path.strip("/")
    if not path or "/" in path:
        return None
    if any(path.startswith(p) for p in IGNORED_PREFIXES):
        return None
    if "." in path:  # asset file, not a page
        return None
    return path


def known_blog_slugs() -> set[str]:
    posts = json.loads(PARSED_POSTS.read_text(encoding="utf-8"))
    return {p["slug"] for p in posts}


def known_static_routes() -> set[str]:
    routes = set()
    for page in APP_DIR.glob("*/page.tsx"):
        name = page.parent.name
        if not name.startswith("["):
            routes.add(name)
    return routes


def main() -> int:
    print("Fetching archived URLs from the Wayback Machine CDX API...")
    try:
        urls = fetch_archived_urls()
    except Exception as e:
        print(f"Could not reach the Wayback Machine API: {e}", file=sys.stderr)
        return 1

    candidate_slugs = {s for u in urls if (s := slug_from_url(u))}
    blog_slugs = known_blog_slugs()
    static_routes = known_static_routes()

    covered = candidate_slugs & (blog_slugs | static_routes)
    orphaned = sorted(candidate_slugs - blog_slugs - static_routes)

    print(f"\nArchived URLs found:      {len(urls)}")
    print(f"Candidate root slugs:     {len(candidate_slugs)}")
    print(f"Covered by /blog redirect or a static route: {len(covered)}")
    print(f"Orphaned (need attention): {len(orphaned)}")

    if orphaned:
        print("\nThese slugs were once live but match no blog post or static route:")
        for slug in orphaned:
            print(f"  - /{slug}")
    else:
        print("\nEvery archived root-level slug is covered. No action needed.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
