import Script from "next/script";

/**
 * GA4, with Google's library (about 180 KB) loaded once the page has
 * finished loading and the browser is idle, instead of competing with the
 * page itself. The `gtag` queue is set up straight away, so the page view
 * and any lead event sent before the library arrives (lib/analytics.ts) wait
 * in `dataLayer` and are sent when it does.
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
      <Script id="ga" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
    </>
  );
}
