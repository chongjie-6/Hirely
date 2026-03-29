import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";
import { ApplicationStatus } from "@/types/database";

export async function addApplication(app: Record<string, unknown>) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Get max sort_order for this status column
  const status = (app.status as string) || "applied";
  const { data: existing } = await supabase
    .from("applications")
    .select("sort_order")
    .eq("user_id", userId)
    .eq("status", status)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("applications")
    .insert({ ...app, user_id: userId, sort_order: nextOrder })
    .select()
    .single();

  if (error) throw error;
  updateTag("applications");
  return data;
}

export async function updateApplication(
  id: string,
  updates: Record<string, unknown>,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  updateTag("applications");
  return data;
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
  updateTag("applications");
}

export async function reorderApplications(
  updates: { id: string; status: ApplicationStatus; sort_order: number }[],
) {
  const supabase = await createClient();

  for (const item of updates) {
    const { error } = await supabase
      .from("applications")
      .update({ status: item.status, sort_order: item.sort_order, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    if (error) throw error;
  }

  updateTag("applications");
}