import { Skill } from "@/types/database";
import { createClient } from "../supabase/server"
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";

export async function getSkills(): Promise<Skill[]> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('skills')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true })
            return data ?? []
        },
        [`skills-${userId}`],
        { tags: ['skills'] }
    )()
}