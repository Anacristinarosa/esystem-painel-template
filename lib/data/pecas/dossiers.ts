import { createClient } from "@/lib/supabase/server";

export interface Dossier {
  id: string;
  cliente_id: string;
  titulo: string;
  descricao: string | null;
  estado: string;
  criado_em: string;
  atualizado_em: string;
}

export async function getDossiersDoCliente(clienteId: string): Promise<Dossier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getDossier(id: string): Promise<Dossier | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getTodosDossiers(): Promise<Dossier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .order("atualizado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}
