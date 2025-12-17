'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role: 'admin' | 'user';
  createdAt: string;
};

export default function UsersManager() {
  const { data: session } = useSession();
  const myEmail = session?.user?.email ?? '';
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/users', {
        cache: 'no-store',
        headers: { accept: 'application/json' },
        redirect: 'manual',
        credentials: 'same-origin',
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Non-JSON response (${res.status})`);
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Алдаа');
      setUsers(data);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setRole = async (id: string, role: 'admin' | 'user') => {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || 'Алдаа');
      return;
    }
    await load();
  };

  const removeUser = async (id: string, email?: string | null) => {
    if (!confirm(`${email ?? 'Энэ хэрэглэгч'}-ийг устгах уу?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || 'Алдаа');
      return;
    }
    await load();
  };

  return (
    <div className="mt-6 bg-purple-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Хэрэглэгчид</h2>
        <button onClick={load} className="px-3 py-1 rounded bg-white/10 hover:bg-black/20">Дахин ачаалах</button>
      </div>

      {loading && <p className="mt-4 text-white/60">Уншиж байна…</p>}
      {err && <p className="mt-4 text-red-400">{err}</p>}

      {!loading && !err && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-white/70">
              <tr>
                <th className="py-2 pr-4">Имэйл</th>
                <th className="py-2 pr-4">Нэр</th>
                <th className="py-2 pr-4">Эрх</th>
                <th className="py-2 pr-4">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = !!u.email && u.email === myEmail;
                return (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      {u.role === 'admin' ? (
                        <button
                          disabled={isMe}
                          onClick={() => setRole(u.id, 'user')}
                          className={`px-2 py-1 rounded ${isMe ? 'bg-white/5 text-black/40' : 'bg-black/10 hover:bg-black/20'}`}
                          title={isMe ? 'Өөрийгөө буулгаж болохгүй' : 'Эрх бууруулах'}
                        >
                          Админ болиулах
                        </button>
                      ) : (
                        <button
                          onClick={() => setRole(u.id, 'admin')}
                          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                        >
                          Админ болгох
                        </button>
                      )}
                      <button
                        disabled={isMe}
                        onClick={() => removeUser(u.id, u.email)}
                        className={`px-2 py-1 rounded ${isMe ? 'bg-white/5 text-white/40' : 'bg-red-500/20 hover:bg-red-500/30 text-red-200'}`}
                        title={isMe ? 'Өөрийгөө устгаж болохгүй' : 'Устгах'}
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}