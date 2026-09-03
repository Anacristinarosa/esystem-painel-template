import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, MessagesSquare } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getDossier } from "@/lib/data/pecas/dossiers";
import { getDocumentosDoDossier } from "@/lib/data/pecas/documentos";
import { getNotasDoDossier } from "@/lib/data/pecas/notas";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Dossier" };

export default async function DossierDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!PLATAFORMA.pecas.dossiers) notFound();
  const perfil = await requerCliente();
  const { id } = await params;
  const dossier = await getDossier(id);
  if (!dossier || dossier.cliente_id !== perfil.id) notFound();

  const documentos = PLATAFORMA.pecas.documentos ? await getDocumentosDoDossier(id) : [];
  const notas = PLATAFORMA.pecas.notas ? await getNotasDoDossier(id) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/dossiers"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Todos os dossiers
          </Link>

          <div className="mb-8">
            <h1 className="font-serif italic text-4xl gold-text-rich mb-3">
              {dossier.titulo}
            </h1>
            {dossier.descricao && (
              <p className="text-ink-soft leading-relaxed">{dossier.descricao}</p>
            )}
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow p-6 mb-8">
            <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium mb-4">
              Estado
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {PLATAFORMA.estadosDossier.map((e, i) => {
                const atual = e === dossier.estado;
                const passado =
                  PLATAFORMA.estadosDossier.indexOf(dossier.estado) > i;
                return (
                  <div key={e} className="flex items-center gap-2">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-xs font-medium transition ${
                        atual
                          ? "bg-gold-foil text-white gold-shadow"
                          : passado
                            ? "bg-gold-100 text-gold-800"
                            : "bg-white gold-border text-ink-faint"
                      }`}
                    >
                      {e}
                    </span>
                    {i < PLATAFORMA.estadosDossier.length - 1 && (
                      <span className="text-gold-400">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {PLATAFORMA.pecas.documentos && (
            <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-gold-600" />
                <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
                  Documentos deste dossier
                </p>
              </div>
              {documentos.length === 0 ? (
                <p className="text-sm text-ink-soft italic">Nenhum documento anexado.</p>
              ) : (
                <ul className="space-y-2">
                  {documentos.map((d) => (
                    <li key={d.id}>
                      <a
                        href={d.ficheiro_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-white gold-border hover:bg-gold-50 transition"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink">{d.nome}</p>
                          {d.descricao && (
                            <p className="text-xs text-ink-soft">{d.descricao}</p>
                          )}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-gold-700">
                          {d.enviado_por}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {PLATAFORMA.pecas.notas && (
            <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessagesSquare className="w-4 h-4 text-gold-600" />
                <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
                  Notas do processo
                </p>
              </div>
              {notas.length === 0 ? (
                <p className="text-sm text-ink-soft italic">Sem notas para já.</p>
              ) : (
                <ul className="space-y-4">
                  {notas.map((n) => (
                    <li
                      key={n.id}
                      className={`rounded-lg p-4 ${
                        n.autor === "founder" ? "bg-gold-50 gold-border" : "bg-white gold-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
                          {n.autor === "founder" ? PLATAFORMA.founder.nome : "Tu"}
                        </p>
                        <p className="text-xs text-ink-faint">
                          {formatarData(n.criada_em)}
                        </p>
                      </div>
                      <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                        {n.mensagem}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
