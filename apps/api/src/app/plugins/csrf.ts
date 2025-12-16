/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyPluginAsync } from "fastify";
import csrf from "csrf";
const tokens = new csrf();

export const csrfPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    const method = req.method.toUpperCase();
    if (method === "GET" || method === "HEAD") return;

    const tokenCookie = (req as any).cookies?.csrfToken;
    const headerToken = req.headers["x-csrf-token"] as string | undefined;

    if (!tokenCookie || !headerToken || !tokens.verify(tokenCookie, headerToken)) {
      reply.code(403).send({ ok: false, error: "Invalid CSRF token" });
    }
  });
};