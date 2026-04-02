
/**
 * Validate a domain with subdomains + hyphens + final TLD (2–63 letters).
 * No protocol allowed. Examples:
 *  - OK: example.com, sub.example.com, exa-mple.co.uk
 *  - BAD: -example.com, example, example. (no TLD), http://example.com
 */
export function isValidDomain(domain: string): boolean {
  // prevent protocol or trailing dots altogether
  if (/^https?:\/\//i.test(domain) || domain.endsWith(".")) return false;

  const domainRegex =
    /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

  return domainRegex.test(domain);
}

export function normalizeDomain(input: string) {
  const raw = (input || "").trim(); // <- const (was let)

  // Strip protocol
  let v = raw.replace(/^https?:\/\//i, "");

  // Strip leading www.
  v = v.replace(/^www\./i, "");

  // Trim leading/trailing slashes
  v = v.replace(/^\/+|\/+$/g, "");

  const firstSlash = v.indexOf("/");
  let host = v;
  let path = "";

  if (firstSlash !== -1) {
    host = v.slice(0, firstSlash);
    path = v.slice(firstSlash + 1).replace(/^\/+|\/+$/g, "");
  }

  const display = path ? `${host}/${path}` : host;
  return { host, path, display };
}

export function isValidPath(path: string): boolean {
  if (!path) return true;
  return path.split("/").every((seg) => /^[a-z0-9.-]+$/i.test(seg));
}
