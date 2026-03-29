import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";

export async function addSkill(skill: {
  name: string;
  category: "technical" | "soft";
}) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .insert({ ...skill, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  updateTag("skills");
  return data;
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;
  updateTag("skills");
}