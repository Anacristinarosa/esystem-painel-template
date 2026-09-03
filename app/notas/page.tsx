import { notFound } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getNotasDoCliente } from "@/lib/data/pecas/notas";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Notas" };

export default async function NotasPage() {
  if (!PLATAFORMA.pecas.notas) notFound();
  const perfil = await requerCliente();
  const notas = await getNotasDoCliente(perfil.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                {PLATAFORMA.labels.notas}
              </p>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
              O diálogo em curso.
            </h1>
          </div>

          {notas.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <MessagesSquare className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <p>Sem notas para já.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {notas.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-2xl p-5 ${
                    n.autor === "founder"
                      ? "bg-gold-50 gold-border-rich"
                      : "bg-cream-50 gold-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
                      {n.autor === "founder" ? PLATAFORMA.founder.nome : "Tu"}
                    </p>
                    <p className="text-xs text-ink-faint">{formatarData(n.criada_em)}</p>
                  </div>
                  <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                    {n.mensagem}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
