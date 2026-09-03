import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getDocumentosDoCliente } from "@/lib/data/pecas/documentos";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Documentos" };

export default async function DocumentosPage() {
  if (!PLATAFORMA.pecas.documentos) notFound();
  const perfil = await requerCliente();
  const documentos = await getDocumentosDoCliente(perfil.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                {PLATAFORMA.labels.documentos}
              </p>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
              Tudo o que trocaste connosco.
            </h1>
          </div>

          {documentos.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <FileText className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <p>Ainda não há documentos partilhados.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {documentos.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.ficheiro_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-4 rounded-xl bg-cream-50 gold-border-rich gold-shadow hover:bg-gold-50 transition"
                  >
                    <div>
                      <p className="font-serif italic text-lg text-ink">{d.nome}</p>
                      {d.descricao && (
                        <p className="text-sm text-ink-soft">{d.descricao}</p>
                      )}
                      <p className="text-xs text-ink-faint mt-1">
                        Enviado por {d.enviado_por === "founder" ? PLATAFORMA.founder.nome : "ti"} · {formatarData(d.criado_em)}
                      </p>
                    </div>
                    <FileText className="w-4 h-4 text-gold-600" />
                  </a>
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
