import { NextResponse } from 'next/server';
import { getD1 } from '@/db/raw';

type RsvpInput = {
  name?: unknown;
  attendance?: unknown;
  phone?: unknown;
  companions?: unknown;
  companionNames?: unknown;
  message?: unknown;
  website?: unknown;
};

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: Request) {
  let input: RsvpInput;
  try {
    input = (await request.json()) as RsvpInput;
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  if (clean(input.website, 100)) {
    return NextResponse.json({ ok: true, id: crypto.randomUUID() });
  }

  const name = clean(input.name, 120);
  const attendance = input.attendance === 'yes' || input.attendance === 'no' ? input.attendance : '';
  const companions = attendance === 'yes' ? Math.min(Math.max(Number(input.companions) || 0, 0), 8) : 0;
  if (name.length < 2 || !attendance) {
    return NextResponse.json({ error: 'Informe seu nome e se poderá comparecer.' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await getD1().prepare(`
    INSERT INTO rsvps (id, name, attendance, phone, companions, companion_names, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    name,
    attendance,
    clean(input.phone, 40) || null,
    companions,
    companions ? clean(input.companionNames, 300) || null : null,
    clean(input.message, 500) || null,
    new Date().toISOString(),
  ).run();

  return NextResponse.json({ ok: true, id, attendance });
}
