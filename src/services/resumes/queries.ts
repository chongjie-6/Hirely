import { TailoredResume } from "@/types/database";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";
export async function getTailoredResume(id: string): Promise<TailoredResume | null> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('tailored_resumes')
                .select('*')
                .eq('id', id)
                .eq('user_id', userId)
                .maybeSingle()
            return data
        },
        [`resume-${userId}-${id}`],
        { tags: ['resumes'] }
    )()
}

export async function getTailoredResumes(): Promise<TailoredResume[]> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('tailored_resumes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
            return data ?? []
        },
        [`resumes-${userId}`],
        { tags: ['resumes'] }
    )()
}