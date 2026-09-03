import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getDossiersDoCliente } from "@/lib/data/pecas/dossiers";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Dossiers" };

export default async function DossiersPage() {
  if (!PLATAFORMA.pecas.dossiers) notFound();
  const perfil = await requerCliente();
  const dossiers = await getDossiersDoCliente(perfil.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                {PLATAFORMA.labels.dossiers}
              </p>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
              Onde estás em cada um.
            </h1>
          </div>

          {dossiers.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <FolderOpen className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <p>Ainda não tens dossiers abertos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dossiers.map((d) => {
                const indiceEstado = PLATAFORMA.estadosDossier.indexOf(d.estado);
                const total = PLATAFORMA.estadosDossier.length;
                const percentagem = total > 0 ? ((indiceEstado + 1) / total) * 100 : 0;
                return (
                  <Link
                    key={d.id}
                    href={`/dossiers/${d.id}`}
                    className="group block rounded-2xl bg-cream-50 gold-border-rich gold-shadow gold-glow-hover p-6 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif italic text-2xl gold-text-rich mb-1">
                          {d.titulo}
                        </h3>
                        {d.descricao && (
                          <p className="text-sm text-ink-soft">{d.descricao}</p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-ink-faint group-hover:text-gold-700 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
                        {d.estado}
                      </p>
                      <span className="text-xs text-ink-faint">
                        · atualizado {formatarData(d.atualizado_em)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gold-100 overflow-hidden">
                      <div
                        className="h-full bg-gold-foil transition-all"
                        style={{ width: `${percentagem}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
