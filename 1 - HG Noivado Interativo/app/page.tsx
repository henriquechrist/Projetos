import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import { RsvpForm } from '@/app/components/rsvp-form';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="botanical-wash" aria-hidden="true" />
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
        <div className="invitation-wrap mx-auto w-full max-w-[480px] lg:max-w-[520px]">
          <span className="ribbon-tab">Nosso convite</span>
          <Image src="/convite.png" alt="Convite do jantar de noivado de Henrique e Gabriela" width={907} height={1280} priority className="invitation-image" />
        </div>

        <div className="relative mx-auto w-full max-w-[650px]">
          <p className="eyebrow">10 de outubro de 2026</p>
          <h1 className="font-serif text-[clamp(3.3rem,9vw,7rem)] leading-[0.82] tracking-[-0.055em] text-primary">
            Henrique
            <span className="block pl-[0.7em] font-script text-[0.72em] font-normal tracking-normal text-accent-foreground">& Gabriela</span>
          </h1>
          <p className="mt-7 max-w-lg font-serif text-2xl leading-relaxed text-foreground/80">A alegria desse momento fica ainda mais bonita com você à mesa.</p>

          <div className="event-details mt-8 grid gap-3 sm:grid-cols-3">
            <div><CalendarDays /><span>Sábado<br /><strong>10 de outubro</strong></span></div>
            <div><Clock3 /><span>A partir das<br /><strong>18 horas</strong></span></div>
            <div><MapPin /><span>Restaurante Soberano<br /><strong>Centro</strong></span></div>
          </div>

          <div className="rsvp-card mt-9">
            <div>
              <p className="eyebrow">Confirmação de presença</p>
              <h2 className="font-serif text-4xl leading-tight">Você vem celebrar conosco?</h2>
            </div>
            <RsvpForm />
          </div>

          <div className="mt-7 flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>Rua Nilo Peçanha, 23 · Centro</span>
            <Link href="/admin" className="transition hover:text-primary">Área dos noivos</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
