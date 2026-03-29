import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";

const supabase = await createClient();

export async function addEducation(edu: Record<string, unknown>) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("education")
    .insert({ ...edu, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  updateTag("education");
  return data;
}

export async function updateEducation(
  id: string,
  updates: Record<string, unknown>,
) {

  const { data, error } = await supabase
    .from("education")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  updateTag("education");
  return data;
}

export async function deleteEducation(id: string) {


  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
  updateTag("education");
}