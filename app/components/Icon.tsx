"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// The stylesheet ships with the root layout, so stop the core library from
// injecting a second copy at runtime — that injection lands after first paint
// and flashes the icons at full glyph size before it lands.
config.autoAddCss = false;

export { FontAwesomeIcon as Icon };
