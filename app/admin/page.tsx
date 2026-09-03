import Link from "next/link";
import { Users, FolderOpen, TrendingUp, FileText, MessagesSquare, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { AdicionarCliente } from "@/components/admin/adicionar-cliente";
import { requerFounder } from "@/lib/auth";
import { getClientes } from "@/lib/data/admin";
import { PLATAFORMA } from "@/lib/config";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Painel da founder" };

export default async function AdminPage() {
  await requerFounder();
  const clientes = await getClientes();

  const atalhos = [
    { key: "dossiers", ativo: PLATAFORMA.pecas.dossiers, href: "/admin/dossiers", label: "Gerir dossiers", icone: FolderOpen },
    { key: "numeros", ativo: PLATAFORMA.pecas.numeros, href: "/admin/numeros", label: "Gerir números", icone: TrendingUp },
    { key: "documentos", ativo: PLATAFORMA.pecas.documentos, href: "/admin/documentos", label: "Gerir documentos", icone: FileText },
    { key: "notas", ativo: PLATAFORMA.pecas.notas, href: "/admin/notas", label: "Gerir notas", icone: MessagesSquare },
  ].filter((a) => a.ativo);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Painel da founder
              </p>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl gold-text-rich">
              {PLATAFORMA.nome}
            </h1>
          </div>

          {atalhos.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {atalhos.map((a) => {
                const Icone = a.icone;
                return (
                  <Link
                    key={a.key}
                    href={a.href}
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-cream-50 gold-border gold-shadow hover:bg-gold-50 transition-all group"
                  >
                    <Icone className="w-4 h-4 text-gold-600" />
                    <span className="text-sm font-medium text-ink">{a.label}</span>
                    <ArrowRight className="w-3 h-3 text-ink-faint group-hover:text-gold-700 transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}

          <AdicionarCliente />

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow overflow-hidden mt-10">
            <div className="px-6 py-4 border-b border-gold-200 flex items-center gap-3">
              <Users className="w-4 h-4 text-gold-600" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-700 font-medium">
                Clientes ({clientes.length})
              </p>
            </div>
            <table className="w-full">
              <thead className="border-b border-gold-200">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Nome</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Dossiers</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Última entrada</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-ink-soft py-10">
                      Ainda não tens clientes registados.
                    </td>
                  </tr>
                ) : (
                  clientes.map((c) => (
                    <tr key={c.id} className="border-b border-gold-100 last:border-0 hover:bg-gold-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/clientes/${c.id}`} className="font-serif italic text-lg text-ink hover:text-gold-700">
                          {c.nome ?? "—"}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-soft">{c.email}</td>
                      <td className="px-6 py-4 text-sm text-ink-soft">{c.num_dossiers}</td>
                      <td className="px-6 py-4 text-xs text-ink-faint">
                        {c.ultima_entrada ? formatarData(c.ultima_entrada) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/clientes/${c.id}`} className="text-xs text-gold-700 hover:text-gold-800">
                          Abrir →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
