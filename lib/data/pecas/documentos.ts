import { createClient } from "@/lib/supabase/server";

export interface DocumentoCliente {
  id: string;
  cliente_id: string;
  dossier_id: string | null;
  nome: string;
  descricao: string | null;
  ficheiro_url: string;
  enviado_por: "founder" | "cliente";
  criado_em: string;
}

export async function getDocumentosDoCliente(clienteId: string): Promise<DocumentoCliente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos_cliente")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("criado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getDocumentosDoDossier(dossierId: string): Promise<DocumentoCliente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos_cliente")
    .select("*")
    .eq("dossier_id", dossierId)
    .order("criado_em", { ascending: false });
  if (error) return [];
  return data ?? [];
}
