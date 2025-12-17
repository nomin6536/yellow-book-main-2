/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

app.addHook('onRequest', async (req) => {
  (req as any).__startTime = process.hrtime.bigint();
});
app.addHook('onResponse', async (req, reply) => {
  try {
    const start: bigint = (req as any).__startTime;
    const ms = Number((process.hrtime.bigint() - start) / BigInt(1_000_000));
    app.log.info({ method: req.method, url: req.url, statusCode: reply.statusCode, ms }, 'req done');
  } catch (e) {
    // ignore
  }
});

app.register(cors, { origin: true });

// Жишээ: бизнесүүд
app.get('/businesses', async (_req, reply) => {
  const items = await prisma.business.findMany({ include: { category: true } });
  return reply.send(items);
});
app.get('/businesses/:id', async (req, reply) => {
  const id = (req.params as any).id as string;
  const item = await prisma.business.findUnique({ where: { id }, include: { category: true } });
  if (!item) return reply.code(404).send({ message: 'Not found' });
  return reply.send(item);
});
app.post('/businesses', async (req, reply) => {
  const data = req.body as any;
  const created = await prisma.business.create({ data });
  return reply.code(201).send(created);
});
app.get('/categories', async (_req, reply) => {
  const cats = await prisma.category.findMany();
  return reply.send(cats);
});
app.get('/businesses/category', async (req, reply) => {
  const q = (req.query as any)?.id as string | undefined;
  if (!q) return reply.code(400).send({ message: 'id required' });
  const items = await prisma.business.findMany({ where: { categoryId: q } });
  return reply.send(items);
});

// Cosine similarity
function cosine(a: number[], b: number[]) {
  const len = Math.min(a.length, b.length);
  if (!len) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

// lightweight query embed
function cheapQueryEmbed(text: string, dim = 128): number[] {
  const base = crypto.createHash('sha256').update(text).digest();
  const bytes: number[] = Array.from(base);
  const arr: number[] = [];
  while (arr.length < dim) arr.push(...bytes);
  return arr.slice(0, dim).map((n) => (n / 127.5) - 1);
}

// AI хайлт: keyword filter + embedding rank + category bonus
app.post('/api/ai/yellow-books/search', async (req, reply) => {
  const body = req.body as { q?: string };
  const q = (body?.q ?? '').trim().toLowerCase();
  if (!q) return reply.code(400).send({ message: 'q required' });

  const qVec = cheapQueryEmbed(q);
  const kw = q.split(/\s+/).filter(Boolean);

  const items = await prisma.business.findMany({ include: { category: true } });

  // 1) энгийн keyword шүүлт
  const prelim = items.filter((b) => {
    const text = [
      b.name, b.description, b.location, b.address,
      b.category?.name,
    ].filter(Boolean).join(' ').toLowerCase();
    return kw.some((k) => text.includes(k));
  });

  const pool = prelim.length ? prelim : items;

  // 2) embedding оноо + категори бонус
  const ranked = pool
    .map((b) => {
      const emb = (b as any).embedding as number[] | null;
      const baseScore = Array.isArray(emb) ? cosine(qVec, emb) : 0;
      const cat = (b.category?.name || '').toLowerCase();
      const bonus =
        (q.includes('ресторан') && cat.includes('ресторан')) ? 0.2 :
        (q.includes('эмнэлэг') && cat.includes('эмнэлэг')) ? 0.2 :
        (q.includes('банк') && cat.includes('банк')) ? 0.2 :
        (q.includes('дэлгүүр') && cat.includes('дэлгүүр')) ? 0.2 :
        (q.includes('номын сан') && cat.includes('номын сан')) ? 0.2 : 0;
      const score = baseScore + bonus;
      return { score, b };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ score, b }) => ({ ...b, _score: Number(score.toFixed(6)) }));

  return reply.send(ranked);
});

const start = async () => {
  try {
    await app.listen({ port: 5050, host: '0.0.0.0' });
    app.log.info('API listening on http://localhost:5050');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};



start();