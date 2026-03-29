import { ApplicationWithResume, Project } from "@/types/database";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";
import { unstable_cache } from "next/cache";

export async function getApplicationsWithResumes(): Promise<ApplicationWithResume[]> {
    const supabase = await createClient();
    const userId = await getCurrentUserId();
    return unstable_cache(
        async () => {
            const { data } = await supabase
                .from('applications')
                .select('*, tailored_resume:tailored_resumes(id, job_title, company_name, match_score)')
                .eq('user_id', userId)
                .order('sort_order', { ascending: true })
            return (data ?? []) as ApplicationWithResume[]
        },
        [`applications-${userId}`],
        { tags: ['applications'] }
    )()
}