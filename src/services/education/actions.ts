"use server";

import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";

export async function addEducation(edu: Record<string, unknown>) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("education")
    .insert({ ...edu, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  updateTag("education");
  return data;
}

export async function updateEducation(
  id: string,
  updates: Record<string, unknown>,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("education")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  updateTag("education");
  return data;
}

export async function deleteEducation(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
  updateTag("education");
}
