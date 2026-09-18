/**
 * Tracks whether any inquiry surface (the side drawer, the lead popup) is on
 * screen. Module scope is shared across the client bundle, so the timed lead
 * popup can check this and skip firing on top of a drawer the visitor opened
 * themselves.
 */
let openCount = 0

export function markInquiryOpen() {
  openCount += 1
}

export function markInquiryClosed() {
  openCount = Math.max(0, openCount - 1)
}

export function isInquiryOpen() {
  return openCount > 0
}
