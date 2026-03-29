import { Experience } from "@/types/database";
import { createClient } from "../supabase/server"
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";

export async function getExperiences(): Promise<Experience[]> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('experiences')
                .select('*')
                .eq('user_id', userId)
                .order('sort_order', { ascending: true })
            return data ?? []
        },
        [`experiences-${userId}`],
        { tags: ['experiences'] }
    )()
}