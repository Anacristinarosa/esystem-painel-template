import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerFounder } from "@/lib/auth";
import { PLATAFORMA } from "@/lib/config";

export const metadata = { title: "Gerir notas" };

export default async function AdminNotasPage() {
  if (!PLATAFORMA.pecas.notas) notFound();
  await requerFounder();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
              Painel · Notas do processo
            </p>
            <h1 className="font-serif italic text-4xl gold-text-rich">
              Notas por cliente
            </h1>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow p-8 text-sm text-ink-soft leading-relaxed">
            <p className="font-medium text-ink mb-3">Como escrever uma nota</p>
            <p className="mb-3">
              Insere em <code>notas_processo</code>:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li><code>cliente_id</code> — o id do cliente</li>
              <li><code>dossier_id</code> — opcional (nota fica dentro de um dossier)</li>
              <li><code>autor</code> — <code>founder</code></li>
              <li><code>mensagem</code> — o que queres deixar</li>
            </ul>
            <p>
              Alternativa: pede à tua ajudante do Claude Code para adicionar.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
