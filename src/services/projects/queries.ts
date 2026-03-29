import { Project } from "@/types/database";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";

export async function getProjects(): Promise<Project[]> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .order('sort_order', { ascending: true })
            return data ?? []
        },
        [`projects-${userId}`],
        { tags: ['projects'] }
    )()
}