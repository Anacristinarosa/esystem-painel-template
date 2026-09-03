import { createClient } from "@/lib/supabase/server";

export interface NumeroLeitura {
  id: string;
  cliente_id: string;
  titulo: string;
  valor: string;
  unidade: string | null;
  leitura: string | null;
  destaque: boolean;
  ordem: number;
  atualizado_em: string;
}

export async function getNumerosDoCliente(clienteId: string): Promise<NumeroLeitura[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("numeros_leitura")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("destaque", { ascending: false })
    .order("ordem", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getNumeroDestaque(clienteId: string): Promise<NumeroLeitura | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("numeros_leitura")
    .select("*")
    .eq("cliente_id", clienteId)
    .eq("destaque", true)
    .order("ordem", { ascending: true })
    .limit(1)
    .single();
  if (error) return null;
  return data;
}
