import { createClient } from "@/lib/supabase/server";

export interface ClienteResumo {
  id: string;
  email: string;
  nome: string | null;
  criada_em: string;
  ultima_entrada: string | null;
  num_dossiers: number;
}

export async function getClientes(): Promise<ClienteResumo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes_view")
    .select("*")
    .order("criada_em", { ascending: false });
  if (error) {
    console.error("getClientes:", error);
    return [];
  }
  return data ?? [];
}

export async function getCliente(id: string): Promise<ClienteResumo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes_view")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}
