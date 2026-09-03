import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerFounder } from "@/lib/auth";
import { PLATAFORMA } from "@/lib/config";

export const metadata = { title: "Gerir documentos" };

export default async function AdminDocumentosPage() {
  if (!PLATAFORMA.pecas.documentos) notFound();
  await requerFounder();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
              Painel · Documentos
            </p>
            <h1 className="font-serif italic text-4xl gold-text-rich">
              Documentos partilhados
            </h1>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow p-8 text-sm text-ink-soft leading-relaxed">
            <p className="font-medium text-ink mb-3">Como enviar um documento a um cliente</p>
            <p className="mb-3">
              1. Sobe o ficheiro para o bucket <code>documentos</code> do Supabase Storage.
              Copia o URL público.
            </p>
            <p className="mb-3">
              2. Insere uma linha em <code>documentos_cliente</code> com:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li><code>cliente_id</code> — o id do cliente</li>
              <li><code>dossier_id</code> — opcional (liga a um dossier específico)</li>
              <li><code>nome</code> — ex: “Apólice Auto”</li>
              <li><code>ficheiro_url</code> — o URL do Storage</li>
              <li><code>enviado_por</code> — <code>founder</code></li>
            </ul>
            <p>
              O cliente vê logo. Também podes pedir à ajudante do Claude Code para preparar isto.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
