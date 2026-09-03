import { notFound } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getNumerosDoCliente } from "@/lib/data/pecas/numeros";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Números" };

export default async function NumerosPage() {
  if (!PLATAFORMA.pecas.numeros) notFound();
  const perfil = await requerCliente();
  const numeros = await getNumerosDoCliente(perfil.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                {PLATAFORMA.labels.numeros}
              </p>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
              Os teus números, com a leitura por dentro.
            </h1>
          </div>

          {numeros.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <TrendingUp className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <p>Sem números para mostrar por agora.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {numeros.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl gold-shadow p-6 ${
                    n.destaque
                      ? "bg-gold-foil text-white"
                      : "bg-cream-50 gold-border-rich"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <p
                      className={`text-[10px] uppercase tracking-widest font-medium ${
                        n.destaque ? "text-white/80" : "text-gold-700"
                      }`}
                    >
                      {n.titulo}
                    </p>
                    <p className="font-serif italic text-4xl">
                      {n.valor}
                      {n.unidade && (
                        <span
                          className={`text-lg ml-1 ${
                            n.destaque ? "text-white/80" : "text-ink-soft"
                          }`}
                        >
                          {n.unidade}
                        </span>
                      )}
                    </p>
                  </div>
                  {n.leitura && (
                    <p
                      className={`text-base leading-relaxed italic ${
                        n.destaque ? "text-white/95" : "text-ink-soft"
                      }`}
                    >
                      “{n.leitura}”
                    </p>
                  )}
                  <p
                    className={`text-xs mt-4 ${
                      n.destaque ? "text-white/60" : "text-ink-faint"
                    }`}
                  >
                    Atualizado {formatarData(n.atualizado_em)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
