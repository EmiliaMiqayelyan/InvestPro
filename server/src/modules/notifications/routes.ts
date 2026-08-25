import { Router, Response } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import {
  listNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "./service";
import { subscribeNotifications } from "./hub";
import { AppError } from "../../shared/errors/AppError";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await listNotifications(auth.sub));
  })
);

router.get(
  "/unread-count",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, { unreadCount: await getUnreadNotificationCount(auth.sub) });
  })
);

router.patch(
  "/:id/read",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const item = await markNotificationRead(auth.sub, param(req, "id"));
    if (!item) throw AppError.notFound("Notification not found");
    return ok(res, {
      notification: item,
      unreadCount: await getUnreadNotificationCount(auth.sub),
    });
  })
);

router.post(
  "/read-all",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const updated = await markAllNotificationsRead(auth.sub);
    return ok(res, { updated, unreadCount: 0 });
  })
);

router.get(
  "/stream",
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const auth = requireAuth(req);
    const userId = auth.sub;

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const send = (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    send("connected", {
      ok: true,
      unreadCount: await getUnreadNotificationCount(userId),
    });

    const unsubscribe = subscribeNotifications(userId, (event, data) => {
      try {
        send(event, data);
      } catch {
        unsubscribe();
        clearInterval(heartbeat);
      }
    });

    const heartbeat = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
      } catch {
        clearInterval(heartbeat);
      }
    }, 25000);

    req.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  })
);

export default router;
