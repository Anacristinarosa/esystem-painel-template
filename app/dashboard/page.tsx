import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderOpen, TrendingUp, FileText, MessagesSquare, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PLATAFORMA, type PecaKey } from "@/lib/config";
import { requerCliente } from "@/lib/auth";
import { getDossiersDoCliente } from "@/lib/data/pecas/dossiers";
import { getNumerosDoCliente } from "@/lib/data/pecas/numeros";

export const metadata = { title: "Início" };

const META = {
  dossiers: { href: "/dossiers", icone: FolderOpen, subtitulo: "Onde estás em cada processo." },
  numeros: { href: "/numeros", icone: TrendingUp, subtitulo: "Os teus números, com a leitura por dentro." },
  documentos: { href: "/documentos", icone: FileText, subtitulo: "Tudo o que trocaste connosco." },
  notas: { href: "/notas", icone: MessagesSquare, subtitulo: "O diálogo em curso." },
} as const;

export default async function DashboardPage() {
  const perfil = await requerCliente();
  if (perfil.role === "founder") redirect("/admin");

  const pecasAtivas = (Object.keys(PLATAFORMA.pecas) as PecaKey[]).filter(
    (k) => PLATAFORMA.pecas[k],
  );
  const ancora = PLATAFORMA.ancora as PecaKey;
  const outras = pecasAtivas.filter((k) => k !== ancora);

  const dossiers = PLATAFORMA.pecas.dossiers
    ? await getDossiersDoCliente(perfil.id)
    : [];
  const numeros = PLATAFORMA.pecas.numeros
    ? await getNumerosDoCliente(perfil.id)
    : [];

  const primeiroNome = perfil.nome?.split(" ")[0] ?? "olá";

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Olá, {primeiroNome}
              </p>
              <div className="w-8 gold-divider" />
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl gold-text-rich">
              {PLATAFORMA.nome}
            </h1>
          </div>

          {PLATAFORMA.pecas[ancora] && (
            <AncoraCard peca={ancora} dossiers={dossiers} numeros={numeros} />
          )}

          {outras.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {outras.map((k) => {
                const Icone = META[k].icone;
                return (
                  <Link
                    key={k}
                    href={META[k].href}
                    className="group block rounded-2xl bg-cream-50 gold-border-rich gold-shadow gold-glow-hover p-6 transition-all"
                  >
                    <div className="w-11 h-11 rounded-full bg-gold-foil gold-shadow flex items-center justify-center mb-4">
                      <Icone className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-serif italic text-2xl gold-text-rich mb-2">
                      {PLATAFORMA.labels[k]}
                    </h3>
                    <p className="text-sm text-ink-soft leading-relaxed">
                      {META[k].subtitulo}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          {pecasAtivas.length === 0 && (
            <div className="text-center py-16">
              <p className="text-ink-soft">
                O teu painel está a ser preparado.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AncoraCard({
  peca,
  dossiers,
  numeros,
}: {
  peca: PecaKey;
  dossiers: Awaited<ReturnType<typeof getDossiersDoCliente>>;
  numeros: Awaited<ReturnType<typeof getNumerosDoCliente>>;
}) {
  const Icone = META[peca].icone;
  return (
    <div className="rounded-3xl bg-cream-50 gold-border-rich gold-shadow p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gold-foil gold-shadow flex items-center justify-center">
          <Icone className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">
            {PLATAFORMA.labels[peca]}
          </p>
          <p className="text-sm text-ink-soft">{META[peca].subtitulo}</p>
        </div>
      </div>

      {peca === "dossiers" && (
        <div className="space-y-3">
          {dossiers.length === 0 ? (
            <p className="text-sm text-ink-soft italic py-4">
              Sem dossiers de momento.
            </p>
          ) : (
            dossiers.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                href={`/dossiers/${d.id}`}
                className="flex items-center justify-between px-5 py-4 rounded-xl bg-white gold-border hover:bg-gold-50 transition-all group"
              >
                <div>
                  <p className="font-serif italic text-lg text-ink">{d.titulo}</p>
                  <p className="text-xs text-gold-700 uppercase tracking-wider mt-0.5">
                    {d.estado}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-gold-700" />
              </Link>
            ))
          )}
          {dossiers.length > 4 && (
            <Link
              href="/dossiers"
              className="block text-center text-xs text-gold-700 hover:text-gold-800 pt-2"
            >
              Ver todos ({dossiers.length}) →
            </Link>
          )}
        </div>
      )}

      {peca === "numeros" && (
        <div className="space-y-3">
          {numeros.length === 0 ? (
            <p className="text-sm text-ink-soft italic py-4">
              Sem números por agora.
            </p>
          ) : (
            numeros.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="px-5 py-4 rounded-xl bg-white gold-border"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-xs uppercase tracking-wider text-gold-700">
                    {n.titulo}
                  </p>
                  <p className="font-serif text-2xl gold-text-rich">
                    {n.valor}
                    {n.unidade && <span className="text-sm text-ink-soft ml-1">{n.unidade}</span>}
                  </p>
                </div>
                {n.leitura && (
                  <p className="text-sm text-ink-soft italic leading-relaxed">
                    “{n.leitura}”
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {peca === "documentos" && (
        <Link
          href="/documentos"
          className="inline-flex items-center gap-2 text-sm text-gold-700 hover:text-gold-800"
        >
          Ver todos os documentos <ArrowRight className="w-3 h-3" />
        </Link>
      )}

      {peca === "notas" && (
        <Link
          href="/notas"
          className="inline-flex items-center gap-2 text-sm text-gold-700 hover:text-gold-800"
        >
          Ver o histórico do diálogo <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
