export async function GET(request: Request) {
  return new Response('Hello, from API!');
}
// apps/web/src/app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const path = payload?.path;
    if (!path) return NextResponse.json({ ok: false, message: 'path required' }, { status: 400 });

    await revalidatePath(path);
    return NextResponse.json({ ok: true, revalidated: path });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
