import { NextResponse } from "next/server";
import { requerFounder } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLATAFORMA } from "@/lib/config";

export async function POST(req: Request) {
  await requerFounder();

  const { email, nome } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ erro: "Email obrigatório." }, { status: 400 });
  }
  if (!nome || typeof nome !== "string") {
    return NextResponse.json({ erro: "Nome obrigatório." }, { status: 400 });
  }

  const password = process.env.PASSWORD_INICIAL ?? PLATAFORMA.passwordInicial;
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { nome: nome.trim() },
  });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }

  const userId = data.user?.id;
  if (userId) {
    await admin.from("perfis").insert({
      id: userId,
      nome: nome.trim(),
      role: "cliente",
    });
  }

  return NextResponse.json({ ok: true, id: userId, password });
}
