"use server";

import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";
import { Profile } from "@/types/database";

export async function updateProfile(updates: Partial<Profile>) {
  const userId = await getCurrentUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { ...updates, user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  updateTag("profile");
  return data;
}