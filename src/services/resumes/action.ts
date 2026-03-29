import { updateTag } from "next/cache";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../user/queries";
import { buildUserMessage, COVER_LETTER_ADDENDUM, SYSTEM_PROMPT } from "@/lib/claude/prompts";
import { getAnthropicClient } from "@/lib/claude/client";

export async function deleteResume(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tailored_resumes")
    .delete()
    .eq("id", id);
  if (error) throw error;
  updateTag("resumes");
}

export async function tailorResume(input: {
  job_description: string;
  job_title?: string;
  company_name?: string;
  include_cover_letter?: boolean;
}): Promise<{ id: string }> {
  const { job_description, job_title, company_name, include_cover_letter } =
    input;

  if (!job_description || job_description.length < 50) {
    throw new Error("Job description must be at least 50 characters");
  }

  const userId = await getCurrentUserId();
  const supabase = await createClient();

  // Fetch all user resume data in parallel
  const [profileRes, experiencesRes, educationRes, skillsRes, projectsRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase
        .from("experiences")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order"),
      supabase
        .from("education")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order"),
      supabase.from("skills").select("*").eq("user_id", userId),
      supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order"),
    ]);

  if (!profileRes.data) {
    throw new Error("Profile not found");
  }

  const userMessage = buildUserMessage(
    job_description,
    profileRes.data,
    experiencesRes.data ?? [],
    educationRes.data ?? [],
    skillsRes.data ?? [],
    projectsRes.data ?? [],
  );

  // Call Claude API
  const systemPrompt = include_cover_letter
    ? SYSTEM_PROMPT + COVER_LETTER_ADDENDUM
    : SYSTEM_PROMPT;

  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: include_cover_letter ? 8192 : 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  // Extract text content from response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No response from AI");
  }

  // Parse the JSON response (strip markdown code fences if present)
  let jsonText = textBlock.text.trim();
  const fenceMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Failed to parse AI response");
  }

  // Save to database
  const { data: savedResume, error: saveError } = await supabase
    .from("tailored_resumes")
    .insert({
      user_id: userId,
      job_title: job_title || null,
      company_name: company_name || null,
      job_description,
      tailored_content: parsed.tailoredContent,
      match_score: parsed.matchScore,
    })
    .select()
    .single();

  if (saveError) throw saveError;

  updateTag("resumes");

  return { id: savedResume.id };
}

export async function updateResumeSectionOrder(
  resumeId: string,
  sectionOrder: string[],
) {
  const supabase = await createClient();

  const { data: resume, error: fetchError } = await supabase
    .from("tailored_resumes")
    .select("tailored_content")
    .eq("id", resumeId)
    .single();

  if (fetchError) throw fetchError;

  const updatedContent = {
    ...(resume.tailored_content as Record<string, unknown>),
    sectionOrder,
  };

  const { error } = await supabase
    .from("tailored_resumes")
    .update({ tailored_content: updatedContent })
    .eq("id", resumeId);

  if (error) throw error;
  updateTag("resumes");
}