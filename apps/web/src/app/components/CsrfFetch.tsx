'use client';

export async function securePost(url: string, body: unknown) {
  const csrf = document.cookie
    .split('; ')
    .find((c) => c.startsWith('csrfToken='))
    ?.split('=')[1];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  return res.json();
}