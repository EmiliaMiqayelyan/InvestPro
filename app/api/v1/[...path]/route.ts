import { NextRequest } from "next/server";
import { handleApiRequest } from "@/lib/server/api-router";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handler(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return handleApiRequest(req, path);
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
