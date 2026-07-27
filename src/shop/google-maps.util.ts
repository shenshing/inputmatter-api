// Resolves a Google Maps short link (https://maps.app.goo.gl/xyz) to the
// permanent google.com/maps/place/... URL it redirects to, by following the
// redirect ourselves server-side. See shop.entity.ts for why: Google's
// short-link redirector serves a flaky JS interstitial instead of a plain
// redirect for macOS browsers, so we never want a visitor's browser to hit
// it directly.
//
// A desktop Chrome-on-Windows User-Agent reliably gets the plain redirect
// (unlike macOS UAs), so that's what this always sends regardless of who's
// actually registering the shop.
const RESOLVER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const RESOLVE_TIMEOUT_MS = 5000;

export async function resolveGoogleMapLongUrl(shortUrl: string): Promise<string | null> {
  try {
    const res = await fetch(shortUrl, {
      redirect: 'manual',
      headers: { 'User-Agent': RESOLVER_USER_AGENT },
      signal: AbortSignal.timeout(RESOLVE_TIMEOUT_MS),
    });
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      return location;
    }
    return null;
  } catch {
    return null;
  }
}
