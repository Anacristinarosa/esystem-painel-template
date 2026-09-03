import { createClient } from "@/lib/supabase/server";

export interface NotaProcesso {
  id: string;
  cliente_id: string;
  dossier_id: string | null;
  autor: "founder" | "cliente";
  mensagem: string;
  criada_em: string;
}

export async function getNotasDoCliente(clienteId: string): Promise<NotaProcesso[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notas_processo")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("criada_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getNotasDoDossier(dossierId: string): Promise<NotaProcesso[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notas_processo")
    .select("*")
    .eq("dossier_id", dossierId)
    .order("criada_em", { ascending: true });
  if (error) return [];
  return data ?? [];
}
