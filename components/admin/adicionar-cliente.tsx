"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PLATAFORMA } from "@/lib/config";

export function AdicionarCliente() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState<
    { tipo: "idle" } | { tipo: "loading" } | { tipo: "ok"; msg: string } | { tipo: "erro"; msg: string }
  >({ tipo: "idle" });

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !nome.trim()) return;

    setEstado({ tipo: "loading" });
    const res = await fetch("/api/admin/criar-cliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nome }),
    });
    const data = await res.json();

    if (!res.ok) {
      setEstado({ tipo: "erro", msg: data.erro ?? "Erro ao adicionar." });
      return;
    }

    setEstado({
      tipo: "ok",
      msg: `Cliente adicionado. Password: ${data.password}`,
    });
    setEmail("");
    setNome("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl bg-cream-50 gold-border gold-shadow p-6 mb-10">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
          Adicionar cliente
        </p>
        <p className="text-sm text-ink-soft">
          Escreve o nome e o email. A password inicial é <strong>{PLATAFORMA.passwordInicial}</strong> — pode ser mudada depois de entrar.
        </p>
      </div>

      <form onSubmit={adicionar} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="text"
          required
          placeholder="nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
        <input
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gold-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
        <Button type="submit" size="sm" disabled={estado.tipo === "loading"}>
          {estado.tipo === "loading" ? "A adicionar…" : "Adicionar"}
        </Button>
      </form>

      {estado.tipo === "ok" && (
        <p className="mt-3 text-sm text-success">{estado.msg}</p>
      )}
      {estado.tipo === "erro" && (
        <p className="mt-3 text-sm text-red-600">{estado.msg}</p>
      )}
    </div>
  );
}
