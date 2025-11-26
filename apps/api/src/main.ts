/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
// BusinessSchema is an ESM-only module; import it dynamically where needed
// path тааруулах хэрэгтэй

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

 app.addHook('onRequest', async (req) => {
  (req as any).__startTime = process.hrtime.bigint();
});

app.addHook('onResponse', async (req, reply) => {
  try {
    const start = (req as any).__startTime as bigint | undefined;
    if (start) {
      const durMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      reply.header('Server-Timing', `app;dur=${durMs.toFixed(2)}`);
    }
  } catch (e) {
    // ignore
  }
});

app.register(cors, { origin: true });
 
// GET: бүх бизнесүүд
app.get("/businesses", async (req, reply) => {
  const businesses = await prisma.business.findMany({
    include: { category: true },
  });
  return businesses;
});
 
// GET: тодорхой бизнес
app.get("/businesses/:id", async (req, reply) => {
  const { id } = req.params as { id: string };
  const business = await prisma.business.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!business) return reply.status(404).send({ message: "Not found" });
  return business;
});
// POST: шинэ бизнес нэмэх
app.post("/businesses", async (req, reply) => {
  try {
    const { BusinessSchema } = await import("@yellow/contract");
    const parsed = BusinessSchema.parse(req.body);
    const newBusiness = await prisma.business.create({ data: parsed });
    return reply.status(201).send(newBusiness);
  } catch (err: any) {
    return reply.status(400).send({ message: err.message });
  }
});

 
app.get("/categories", async () => {
  return await prisma.category.findMany();

});

app.get("/businesses/category", async (req, reply) => {
  const { categoryId } = req.query as { categoryId?: string };

  // categoryId шалгах
  if (!categoryId) {
    return reply.status(400).send({ message: "categoryId parameter is required" });
  }

  try {
    const businesses = await prisma.business.findMany({
      where: { categoryId },
      include: { category: true },
    });

    if (businesses.length === 0) {
      return reply.status(404).send({ message: "No businesses found for this category" });
    }

    return businesses;
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
});


const start = async () => {
  try {
    await app.listen({ port: 5050, host: "0.0.0.0" });
    console.log("🚀 API ready on http://localhost:5050");
  } catch (err) {
    (app.log as any).error(err);
    process.exit(1);
  }
};



start();