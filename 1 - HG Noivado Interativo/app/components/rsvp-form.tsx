'use client';

import { useEffect, useState } from 'react';
import { Check, Heart, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';

type Attendance = 'yes' | 'no' | '';

async function submitRsvp(payload: Record<string, unknown>) {
  const response = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as { ok?: boolean; error?: string; id?: string; attendance?: Attendance };
  if (!response.ok || !result.ok) throw new Error(result.error || 'Não foi possível enviar sua resposta.');
  return result;
}

export function RsvpForm() {
  const [attendance, setAttendance] = useState<Attendance>('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const context = typeof document === 'undefined' ? undefined : document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'confirm_engagement_dinner_attendance',
      title: 'Confirmar presença no jantar de noivado',
      description: 'Registra a resposta de presença de um convidado no jantar de noivado de Henrique e Gabriela.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 120 },
          attendance: { type: 'string', enum: ['yes', 'no'] },
          phone: { type: 'string', maxLength: 40 },
          companions: { type: 'integer', minimum: 0, maximum: 8 },
          companionNames: { type: 'string', maxLength: 300 },
          message: { type: 'string', maxLength: 500 },
        },
        required: ['name', 'attendance'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input: unknown) {
        const data = input as Record<string, unknown>;
        if (typeof data.name !== 'string' || !['yes', 'no'].includes(String(data.attendance))) throw new Error('Nome e resposta de presença são obrigatórios.');
        const result = await submitRsvp(data);
        setGuestName(String(data.name));
        setAttendance(String(data.attendance) as Attendance);
        setStatus('success');
        return { id: result.id, attendance: result.attendance, status: 'registered' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nameEntry = form.get('name');
    const name = typeof nameEntry === 'string' ? nameEntry.trim() : '';
    if (!attendance) { setError('Conte para nós se você poderá estar presente.'); return; }
    setStatus('sending');
    setError('');
    try {
      await submitRsvp({
        name,
        attendance,
        phone: form.get('phone'),
        companions: Number(form.get('companions') || 0),
        companionNames: form.get('companionNames'),
        message: form.get('message'),
        website: form.get('website'),
      });
      setGuestName(name);
      setStatus('success');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível enviar sua resposta.');
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-5 text-center" aria-live="polite">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-7" /></span>
        <p className="mt-5 font-serif text-4xl">Resposta recebida, {guestName.split(' ')[0]}!</p>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{attendance === 'yes' ? 'Ficamos muito felizes em ter você conosco. Nos vemos à mesa!' : 'Sentiremos sua falta, mas agradecemos por nos avisar com carinho.'}</p>
        <Button variant="ghost" className="mt-5" onClick={() => { setStatus('idle'); setAttendance(''); setGuestName(''); }}>Enviar outra resposta</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <div className="hidden" aria-hidden="true"><Label htmlFor="website">Website</Label><Input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="space-y-2"><Label htmlFor="name">Seu nome completo</Label><Input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Como está no convite" className="h-12 bg-white/70" /></div>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Você poderá comparecer?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Label className="attendance-choice"><input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} /><span><Heart className="size-5" />Sim, estarei presente</span></Label>
          <Label className="attendance-choice"><input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} /><span>Infelizmente, não poderei</span></Label>
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="phone">WhatsApp <span className="font-normal text-muted-foreground">(opcional)</span></Label><Input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="(00) 00000-0000" className="h-12 bg-white/70" /></div>
        {attendance === 'yes' && <div className="space-y-2"><Label htmlFor="companions">Acompanhantes</Label><NativeSelect id="companions" name="companions" defaultValue="0" className="w-full [&_select]:h-12 [&_select]:bg-white/70"><NativeSelectOption value="0">Somente eu</NativeSelectOption>{[1,2,3,4,5,6,7,8].map((n) => <NativeSelectOption key={n} value={n}>{n} {n === 1 ? 'acompanhante' : 'acompanhantes'}</NativeSelectOption>)}</NativeSelect></div>}
      </div>
      {attendance === 'yes' && <div className="space-y-2"><Label htmlFor="companionNames">Nome dos acompanhantes <span className="font-normal text-muted-foreground">(se houver)</span></Label><Input id="companionNames" name="companionNames" maxLength={300} placeholder="Separe os nomes por vírgula" className="h-12 bg-white/70" /></div>}
      <div className="space-y-2"><Label htmlFor="message">Uma mensagem para os noivos <span className="font-normal text-muted-foreground">(opcional)</span></Label><Textarea id="message" name="message" maxLength={500} placeholder="Deixe seu carinho por aqui" className="min-h-24 bg-white/70" /></div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" className="h-12 w-full text-base" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="animate-spin" />Enviando...</> : 'Confirmar minha resposta'}</Button>
    </form>
  );
}

declare global { interface Document { modelContext?: { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> } } }
