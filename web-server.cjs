/**
 * Production web server.
 *
 * nginx talks to 127.0.0.1. Next builds absolute URLs from the hostname and
 * port passed here, so those must be the public site (xsinvest.org:443), not
 * the bind address. Location headers that still mention a loopback host or an
 * internal port are rewritten before they reach the browser.
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = Number(process.env.PORT || 3926);
const dev = process.env.NODE_ENV !== "production";
const publicHost = (process.env.NEXT_PUBLIC_PUBLIC_HOST || "xsinvest.org")
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const app = next({
  dev,
  hostname: publicHost,
  port: 443,
});
const handle = app.getRequestHandler();

const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const INTERNAL_PORTS = new Set(["3000", "3926", "4000", "4926"]);

function browserOrigin(req) {
  const headerHost = String(req.headers["x-forwarded-host"] || req.headers.host || "")
    .split(",")[0]
    .trim();
  const hostname = headerHost.replace(/^\[|\]$/g, "").split(":")[0];
  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim() || "https";
  if (headerHost && !LOOPBACK.has(hostname)) {
    const host = headerHost.replace(/:(80|443)$/, "");
    return `${proto}://${host}`;
  }
  return `https://${publicHost}`;
}

function rewriteAbsolute(value, req) {
  if (typeof value !== "string" || !value) return value;
  let url;
  try {
    url = new URL(value, browserOrigin(req));
  } catch {
    return value;
  }
  const ownHost = url.hostname === publicHost || url.hostname === `www.${publicHost}`;
  const loopback = LOOPBACK.has(url.hostname);
  const internalPort = INTERNAL_PORTS.has(url.port);
  const defaultPort = ownHost && (url.port === "443" || url.port === "80");
  if (!loopback && !internalPort && !defaultPort) return value;
  return new URL(url.pathname + url.search + url.hash, browserOrigin(req)).toString();
}

function patchLocation(req, headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) return headers;
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() !== "location") continue;
    const value = headers[key];
    headers[key] = Array.isArray(value)
      ? value.map((item) => rewriteAbsolute(String(item), req))
      : rewriteAbsolute(String(value), req);
  }
  return headers;
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const origSetHeader = res.setHeader.bind(res);
    const origWriteHead = res.writeHead.bind(res);
    res.setHeader = (name, value) => {
      if (String(name).toLowerCase() === "location") {
        value = Array.isArray(value)
          ? value.map((item) => rewriteAbsolute(String(item), req))
          : rewriteAbsolute(String(value), req);
      }
      return origSetHeader(name, value);
    };
    res.writeHead = (status, headersOrMessage, maybeHeaders) => {
      if (typeof headersOrMessage === "object") {
        return origWriteHead(status, patchLocation(req, headersOrMessage));
      }
      return origWriteHead(status, headersOrMessage, patchLocation(req, maybeHeaders));
    };
    handle(req, res, parsedUrl);
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Ready on http://127.0.0.1:${port}`);
  });
});
