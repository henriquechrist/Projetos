'use client';

import { useState } from 'react';
import { KeyRound, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError('Senha incorreta. Tente novamente.');
      setStatus('idle');
      return;
    }

    window.location.reload();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="botanical-wash" aria-hidden="true" />
      <form onSubmit={submit} className="rsvp-card relative w-full max-w-md">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-primary"><KeyRound /></div>
        <p className="eyebrow mt-5 text-center">Área reservada</p>
        <h1 className="mt-2 text-center font-serif text-4xl">Lista de convidados</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">Digite a senha dos noivos para acessar as confirmações.</p>
        <div className="mt-7 space-y-2">
          <Label htmlFor="admin-password">Senha</Label>
          <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus />
        </div>
        {error ? <p className="mt-3 text-sm text-destructive" role="alert">{error}</p> : null}
        <Button className="mt-5 w-full" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? <><LoaderCircle className="animate-spin" />Entrando...</> : 'Acessar lista'}
        </Button>
        <a href="/" className="mt-5 block text-center text-sm text-muted-foreground hover:text-primary">← Voltar ao convite</a>
      </form>
    </main>
  );
}
