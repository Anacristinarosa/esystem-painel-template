import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerFounder } from "@/lib/auth";
import { PLATAFORMA } from "@/lib/config";

export const metadata = { title: "Gerir números" };

export default async function AdminNumerosPage() {
  if (!PLATAFORMA.pecas.numeros) notFound();
  await requerFounder();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
              Painel · Números com leitura
            </p>
            <h1 className="font-serif italic text-4xl gold-text-rich">
              Números por cliente
            </h1>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow p-8 text-sm text-ink-soft leading-relaxed">
            <p className="font-medium text-ink mb-3">Como criar um número com leitura</p>
            <p className="mb-3">
              Cada linha na tabela <code>numeros_leitura</code> pertence a um cliente.
              Os campos:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li><code>cliente_id</code> — o id do cliente (vais buscar em Clientes)</li>
              <li><code>titulo</code> — ex: “Margem líquida”</li>
              <li><code>valor</code> — ex: “18”</li>
              <li><code>unidade</code> — ex: “%”</li>
              <li><code>leitura</code> — a tua interpretação (2-3 frases)</li>
              <li><code>destaque</code> — <code>true</code> para aparecer em grande</li>
              <li><code>ordem</code> — 0 no topo</li>
            </ul>
            <p>
              Faz isso no Supabase Table Editor ou pede à tua ajudante do Claude Code.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
