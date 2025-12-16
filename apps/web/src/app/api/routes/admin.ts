import { FastifyInstance } from "fastify";

export default async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (req, reply) => {
    const role = (req.headers["x-role"] as string) || "user";
    if (role !== "admin") {
      reply.code(403).send({ ok: false, error: "Forbidden" });
    }
  });

  app.get("/admin/stats", async () => ({ ok: true, stats: { users: 1, businesses: 5 } }));
}