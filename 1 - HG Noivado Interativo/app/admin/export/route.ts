import { NextResponse } from 'next/server';
import { getD1 } from '@/db/raw';
import { requireAdmin } from '../guard';

export const dynamic = 'force-dynamic';

type Row = { name: string; attendance: string; phone: string | null; companions: number; companion_names: string | null; message: string | null; created_at: string };
const csvCell = (value: string | number | null | undefined) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  const result = await getD1().prepare('SELECT name, attendance, phone, companions, companion_names, message, created_at FROM rsvps ORDER BY created_at DESC').all<Row>();
  const header = ['Nome', 'Resposta', 'Telefone', 'Acompanhantes', 'Nomes dos acompanhantes', 'Mensagem', 'Recebido em'];
  const lines = [header, ...(result.results || []).map((row) => [row.name, row.attendance === 'yes' ? 'Confirmado' : 'Não poderá ir', row.phone, row.companions, row.companion_names, row.message, row.created_at])];
  const csv = '\uFEFF' + lines.map((line) => line.map(csvCell).join(';')).join('\r\n');
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="confirmacoes-noivado.csv"', 'Cache-Control': 'no-store' } });
}
