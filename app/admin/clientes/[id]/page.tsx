import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FolderOpen, TrendingUp, FileText, MessagesSquare } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerFounder } from "@/lib/auth";
import { getCliente } from "@/lib/data/admin";
import { getDossiersDoCliente } from "@/lib/data/pecas/dossiers";
import { getNumerosDoCliente } from "@/lib/data/pecas/numeros";
import { getDocumentosDoCliente } from "@/lib/data/pecas/documentos";
import { getNotasDoCliente } from "@/lib/data/pecas/notas";
import { PLATAFORMA } from "@/lib/config";
import { formatarData } from "@/lib/utils";

export const metadata = { title: "Cliente" };

export default async function ClienteFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requerFounder();
  const { id } = await params;
  const cliente = await getCliente(id);
  if (!cliente) notFound();

  const dossiers = PLATAFORMA.pecas.dossiers ? await getDossiersDoCliente(id) : [];
  const numeros = PLATAFORMA.pecas.numeros ? await getNumerosDoCliente(id) : [];
  const documentos = PLATAFORMA.pecas.documentos ? await getDocumentosDoCliente(id) : [];
  const notas = PLATAFORMA.pecas.notas ? await getNotasDoCliente(id) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Painel
          </Link>

          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">Cliente</p>
            <h1 className="font-serif italic text-4xl gold-text-rich mb-2">
              {cliente.nome ?? "—"}
            </h1>
            <p className="text-sm text-ink-soft">{cliente.email}</p>
            <p className="text-xs text-ink-faint mt-1">
              Registado {formatarData(cliente.criada_em)}
              {cliente.ultima_entrada &&
                ` · última entrada ${formatarData(cliente.ultima_entrada)}`}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {PLATAFORMA.pecas.dossiers && (
              <Bloco titulo={PLATAFORMA.labels.dossiers} icone={FolderOpen} vazio={dossiers.length === 0}>
                <ul className="space-y-2">
                  {dossiers.map((d) => (
                    <li key={d.id} className="text-sm">
                      <span className="font-medium">{d.titulo}</span>
                      <span className="text-xs text-gold-700 uppercase tracking-wider ml-2">
                        {d.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              </Bloco>
            )}

            {PLATAFORMA.pecas.numeros && (
              <Bloco titulo={PLATAFORMA.labels.numeros} icone={TrendingUp} vazio={numeros.length === 0}>
                <ul className="space-y-2">
                  {numeros.map((n) => (
                    <li key={n.id} className="text-sm">
                      <span className="text-ink-soft">{n.titulo}:</span>{" "}
                      <span className="font-medium">
                        {n.valor}
                        {n.unidade}
                      </span>
                    </li>
                  ))}
                </ul>
              </Bloco>
            )}

            {PLATAFORMA.pecas.documentos && (
              <Bloco titulo={PLATAFORMA.labels.documentos} icone={FileText} vazio={documentos.length === 0}>
                <p className="text-sm text-ink-soft">{documentos.length} ficheiros</p>
              </Bloco>
            )}

            {PLATAFORMA.pecas.notas && (
              <Bloco titulo={PLATAFORMA.labels.notas} icone={MessagesSquare} vazio={notas.length === 0}>
                <p className="text-sm text-ink-soft">{notas.length} mensagens</p>
              </Bloco>
            )}
          </div>

          <div className="mt-10 rounded-xl bg-gold-50 gold-border p-5 text-sm text-ink-soft">
            <p className="font-medium text-ink mb-2">Como editar o que este cliente vê</p>
            <p>
              Para já, cria/edita dossiers, números, documentos e notas diretamente no
              Supabase Table Editor (filtra por <code>cliente_id = {id}</code>) ou pede à
              tua ajudante do Claude Code para o fazer.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Bloco({
  titulo,
  icone: Icone,
  vazio,
  children,
}: {
  titulo: string;
  icone: typeof FolderOpen;
  vazio: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icone className="w-4 h-4 text-gold-600" />
        <p className="text-[10px] uppercase tracking-widest text-gold-700 font-medium">
          {titulo}
        </p>
      </div>
      {vazio ? (
        <p className="text-sm text-ink-soft italic">Sem registos.</p>
      ) : (
        children
      )}
    </div>
  );
}
