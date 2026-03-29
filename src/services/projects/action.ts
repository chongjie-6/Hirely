import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";

export async function addProject(project: Record<string, unknown>) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...project, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  updateTag("projects");
  return data;
}

export async function updateProject(
  id: string,
  updates: Record<string, unknown>,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  updateTag("projects");
  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  updateTag("projects");
}