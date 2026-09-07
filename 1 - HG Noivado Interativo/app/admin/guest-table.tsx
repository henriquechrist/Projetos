'use client';

import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type RsvpRow = {
  id: string; name: string; attendance: 'yes' | 'no'; phone: string | null;
  companions: number; companion_names: string | null;
  message: string | null; created_at: string;
};

export function GuestTable({ rows }: { rows: RsvpRow[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const visible = useMemo(() => rows.filter((row) => {
    const matchesFilter = filter === 'all' || row.attendance === filter;
    const haystack = `${row.name} ${row.phone || ''} ${row.companion_names || ''}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [rows, query, filter]);

  return (
    <section className="admin-panel mt-8">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou telefone" className="h-10 bg-white pl-9" /></div>
        <NativeSelect value={filter} onChange={(event) => setFilter(event.target.value)} className="w-full sm:w-48 [&_select]:h-10 [&_select]:bg-white"><NativeSelectOption value="all">Todas as respostas</NativeSelectOption><NativeSelectOption value="yes">Confirmados</NativeSelectOption><NativeSelectOption value="no">Não poderão ir</NativeSelectOption></NativeSelect>
      </div>
      {visible.length === 0 ? (
        <div className="grid min-h-64 place-items-center p-10 text-center"><div><Users className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-serif text-2xl">Nenhuma resposta encontrada</p><p className="mt-1 text-sm text-muted-foreground">Ajuste a busca ou aguarde novas confirmações.</p></div></div>
      ) : (
        <Table>
          <TableHeader><TableRow><TableHead>Convidado</TableHead><TableHead>Resposta</TableHead><TableHead>Total</TableHead><TableHead>Contato</TableHead><TableHead>Detalhes</TableHead><TableHead>Recebido em</TableHead></TableRow></TableHeader>
          <TableBody>{visible.map((row) => <TableRow key={row.id}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell><Badge variant={row.attendance === 'yes' ? 'default' : 'secondary'}>{row.attendance === 'yes' ? 'Confirmado' : 'Não vai'}</Badge></TableCell>
            <TableCell>{row.attendance === 'yes' ? 1 + row.companions : '—'}</TableCell>
            <TableCell>{row.phone || '—'}</TableCell>
            <TableCell className="max-w-xs whitespace-normal text-muted-foreground">{[row.companion_names && `Acompanhantes: ${row.companion_names}`, row.message && `Mensagem: ${row.message}`].filter(Boolean).join(' · ') || '—'}</TableCell>
            <TableCell>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.created_at))}</TableCell>
          </TableRow>)}</TableBody>
        </Table>
      )}
    </section>
  );
}
