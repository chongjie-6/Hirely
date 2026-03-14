import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnthropicClient } from '@/lib/claude/client'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/claude/prompts'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { job_description, job_title, company_name } = body

    if (!job_description || job_description.length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters' },
        { status: 400 }
      )
    }

    // Fetch all user resume data in parallel
    const [profileRes, experiencesRes, educationRes, skillsRes, projectsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('experiences').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('education').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('skills').select('*').eq('user_id', user.id),
      supabase.from('projects').select('*').eq('user_id', user.id).order('sort_order'),
    ])

    if (!profileRes.data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const userMessage = buildUserMessage(
      job_description,
      profileRes.data,
      experiencesRes.data ?? [],
      educationRes.data ?? [],
      skillsRes.data ?? [],
      projectsRes.data ?? []
    )

    // Call Claude API
    const anthropic = getAnthropicClient()
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    // Extract text content from response
    const textBlock = response.content.find(block => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    let parsed
    try {
      parsed = JSON.parse(textBlock.text)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    // Save to database
    const { data: savedResume, error: saveError } = await supabase
      .from('tailored_resumes')
      .insert({
        user_id: user.id,
        job_title: job_title || null,
        company_name: company_name || null,
        job_description,
        tailored_content: parsed.tailoredContent,
        match_score: parsed.matchScore,
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 })
    }

    return NextResponse.json({
      id: savedResume.id,
      tailoredContent: parsed.tailoredContent,
      matchScore: parsed.matchScore,
    })
  } catch (error) {
    console.error('Tailor API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
