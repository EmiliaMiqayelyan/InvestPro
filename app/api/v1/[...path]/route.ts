import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = (process.env.BACKEND_URL || "http://127.0.0.1:4000").replace(/\/$/, "");

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const pathStr = path.join("/");
  const incomingUrl = new URL(req.url);
  const target = `${BACKEND_URL}/api/v1/${pathStr}${incomingUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "host" || lower === "connection" || lower === "content-length") return;
    headers.set(key, value);
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    // @ts-expect-error duplex needed for streaming bodies in Node fetch
    duplex: "half",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  try {
    const upstream = await fetch(target, init);
    const contentType = upstream.headers.get("content-type") || "";

    // SSE / streaming passthrough
    if (
      contentType.includes("text/event-stream") ||
      pathStr === "notifications/stream"
    ) {
      const resHeaders = new Headers();
      upstream.headers.forEach((value, key) => {
        if (key.toLowerCase() === "transfer-encoding") return;
        resHeaders.set(key, value);
      });
      resHeaders.set("Cache-Control", "no-cache, no-transform");
      resHeaders.set("Connection", "keep-alive");
      resHeaders.set("X-Accel-Buffering", "no");
      return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: resHeaders,
      });
    }

    const buf = await upstream.arrayBuffer();
    const resHeaders = new Headers();
    upstream.headers.forEach((value, key) => {
      if (["transfer-encoding", "content-encoding"].includes(key.toLowerCase())) return;
      resHeaders.set(key, value);
    });
    return new NextResponse(buf, { status: upstream.status, headers: resHeaders });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "API backend is unavailable. Start the Express server (npm run server:dev) or check BACKEND_URL.",
        code: "BACKEND_UNAVAILABLE",
      },
      { status: 503 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
