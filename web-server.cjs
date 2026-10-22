/**
 * Production web server.
 *
 * Next must be told its hostname is "localhost". It rewrites a 127.0.0.1 bind
 * address to localhost inside middleware, then emits an absolute
 * https://localhost:<port>/... redirect that the browser follows off the
 * public site. The process still listens only on 127.0.0.1 for the proxy.
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = Number(process.env.PORT || 3926);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname: "localhost", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Ready on http://127.0.0.1:${port}`);
  });
});
