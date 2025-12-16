import * as path from 'path';
import fastify, { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import { csrfPlugin } from "./plugins/csrf";

export async function buildApp() {
  const app = fastify({ logger: true });

  await app.register(require('@fastify/cookie'));
  await app.register(csrfPlugin);

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: {},
  });

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {},
  });

  return app;
}


/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}