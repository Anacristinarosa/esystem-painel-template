import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerFounder } from "@/lib/auth";
import { getTodosDossiers } from "@/lib/data/pecas/dossiers";
import { getClientes } from "@/lib/data/admin";
import { PLATAFORMA } from "@/lib/config";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Gerir dossiers" };

export default async function AdminDossiersPage() {
  if (!PLATAFORMA.pecas.dossiers) notFound();
  await requerFounder();
  const [dossiers, clientes] = await Promise.all([getTodosDossiers(), getClientes()]);
  const nomePorId = new Map(clientes.map((c) => [c.id, c.nome ?? c.email]));

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
              Painel · Dossiers
            </p>
            <h1 className="font-serif italic text-4xl gold-text-rich">
              Todos os dossiers
            </h1>
          </div>

          <div className="rounded-xl bg-gold-50 gold-border p-5 text-sm text-ink-soft mb-6">
            <p className="font-medium text-ink mb-2">Como criar / editar</p>
            <p>
              Vai ao Supabase Table Editor → tabela <code>dossiers</code>. Insere
              <code> cliente_id</code>, <code>titulo</code>, <code>estado</code> (um dos:
              {" "}
              {PLATAFORMA.estadosDossier.map((e, i) => (
                <span key={e}>
                  <code>{e}</code>
                  {i < PLATAFORMA.estadosDossier.length - 1 && ", "}
                </span>
              ))}
              ). Ou pede à ajudante do Claude Code.
            </p>
          </div>

          <div className="rounded-2xl bg-cream-50 gold-border-rich gold-shadow overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gold-200">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Cliente</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Título</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Estado</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-ink-soft py-10">
                      Sem dossiers ainda.
                    </td>
                  </tr>
                ) : (
                  dossiers.map((d) => (
                    <tr key={d.id} className="border-b border-gold-100 last:border-0">
                      <td className="px-6 py-4 text-sm">
                        {nomePorId.get(d.cliente_id) ?? d.cliente_id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{d.titulo}</td>
                      <td className="px-6 py-4 text-xs uppercase tracking-widest text-gold-700">
                        {d.estado}
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-faint">
                        {formatarData(d.atualizado_em)}
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
