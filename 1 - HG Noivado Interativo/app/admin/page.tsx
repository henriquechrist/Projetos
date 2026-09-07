import Link from 'next/link';
import { Download, Heart, LogOut, Users, UserX } from 'lucide-react';
import { getD1 } from '@/db/raw';
import { requireAdmin } from './guard';
import { GuestTable, type RsvpRow } from './guest-table';
import { AdminLogin } from './login-form';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await requireAdmin())) return <AdminLogin />;

  const result = await getD1().prepare('SELECT id, name, attendance, phone, companions, companion_names, message, created_at FROM rsvps ORDER BY created_at DESC').all<RsvpRow>();
  const rows = result.results || [];
  const confirmed = rows.filter((row) => row.attendance === 'yes');
  const declined = rows.length - confirmed.length;
  const seats = confirmed.reduce((total, row) => total + 1 + row.companions, 0);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="botanical-wash" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="eyebrow">Henrique & Gabriela</p><h1 className="font-serif text-4xl sm:text-5xl">Lista de convidados</h1><p className="mt-1 text-sm text-muted-foreground">Acompanhe aqui todas as respostas recebidas.</p></div>
          <div className="flex flex-wrap gap-2"><a href="/admin/export" download className="admin-action"><Download />Exportar CSV</a><form action="/api/admin/logout" method="post"><button type="submit" className="admin-action border-transparent bg-transparent"><LogOut />Sair</button></form></div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Summary icon={<Users />} label="Respostas recebidas" value={rows.length} />
          <Summary icon={<Heart />} label="Lugares confirmados" value={seats} />
          <Summary icon={<UserX />} label="Não poderão ir" value={declined} />
        </section>
        <GuestTable rows={rows} />
        <Link href="/" className="mt-6 inline-block text-sm text-muted-foreground hover:text-primary">← Voltar ao convite</Link>
      </div>
    </main>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="summary-card"><span>{icon}</span><div><strong>{value}</strong><p>{label}</p></div></div>;
}
