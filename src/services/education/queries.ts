import { Education } from "@/types/database";
import { createClient } from "../supabase/server"
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";

export async function getEducation(): Promise<Education[]> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('education')
                .select('*')
                .eq('user_id', userId)
                .order('sort_order', { ascending: true })
            return data ?? []
        },
        [`education-${userId}`],
        { tags: ['education'] }
    )()
}