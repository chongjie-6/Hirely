import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";

export async function addExperience(exp: Record<string, unknown>) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("experiences")
    .insert({ ...exp, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  updateTag("experiences");
  return data;
}

export async function updateExperience(
  id: string,
  updates: Record<string, unknown>,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("experiences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  updateTag("experiences");
  return data;
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
  updateTag("experiences");
}
