import { Profile } from "@/types/database";
import { createClient } from "../supabase/server"
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";

export async function getProfile(): Promise<Profile | null> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle()
            return data
        },
        [`profile-${userId}`],
        { tags: ['profile'] }
    )()
}