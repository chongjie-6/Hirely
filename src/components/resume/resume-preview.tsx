import type { TailoredContent, Profile } from '@/types/database'
import { formatDateRange } from '@/lib/utils'

interface ResumePreviewProps {
  content: TailoredContent
  profile: Profile
  showSummary?: boolean
  renderSectionWrapper?: (sectionKey: string, children: React.ReactNode) => React.ReactNode
}

export default function ResumePreview({ content, profile, showSummary = true, renderSectionWrapper }: ResumePreviewProps) {
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'summary':
        return (content.summary && showSummary) ? (
          <section key="summary" className="mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">{content.summary}</p>
          </section>
        ) : null

      case 'experience':
        return content.experiences?.length > 0 ? (
          <section key="experience" className="mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Professional Experience
            </h2>
            {content.experiences.map((exp, i) => (
              <div key={exp.id || i} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                  </span>
                </div>
                <p className="text-base text-gray-600 italic">{exp.company}</p>
                {exp.description && (
                  <div className="mt-1 text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </section>
        ) : null

      case 'education':
        return content.education?.length > 0 ? (
          <section key="education" className="mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            {content.education.map((edu, i) => (
              <div key={edu.id || i} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-semibold text-gray-900">
                    {edu.degree && edu.field_of_study
                      ? `${edu.degree} in ${edu.field_of_study}`
                      : edu.degree || edu.field_of_study || 'Degree'}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                    {formatDateRange(edu.start_date, edu.end_date)}
                  </span>
                </div>
                <p className="text-base text-gray-600">{edu.school}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                {edu.description && (
                  <p className="mt-1 text-base text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        ) : null

      case 'skills':
        return (content.skills?.technical?.length > 0 || content.skills?.soft?.length > 0) ? (
          <section key="skills" className="mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            {content.skills.technical?.length > 0 && (
              <p className="text-base text-gray-700">
                <span className="font-medium">Technical:</span> {content.skills.technical.join(', ')}
              </p>
            )}
            {content.skills.soft?.length > 0 && (
              <p className="text-base text-gray-700 mt-1">
                <span className="font-medium">Soft Skills:</span> {content.skills.soft.join(', ')}
              </p>
            )}
          </section>
        ) : null

      case 'projects':
        return content.projects?.length > 0 ? (
          <section key="projects" className="mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Projects
            </h2>
            {content.projects.map((proj, i) => (
              <div key={proj.id || i} className="mb-2 last:mb-0">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{proj.name}</h3>
                  {proj.technologies?.length > 0 && (
                    <span className="text-sm text-gray-500">
                      ({proj.technologies.join(', ')})
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-base text-gray-700 mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </section>
        ) : null

      default:
        return null
    }
  }

  const sectionOrder = content.sectionOrder ?? ['summary', 'experience', 'skills', 'projects', 'education']

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-200 mx-auto" id="resume-preview">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
        <div className="flex items-center justify-center gap-2 flex-wrap mt-1 text-base text-gray-600">
          {profile.email && <span>{profile.email}</span>}
          {profile.email && profile.phone && <span>·</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {(profile.email || profile.phone) && profile.location && <span>·</span>}
          {profile.location && <span>{profile.location}</span>}
        </div>
        <div className="flex items-center justify-center gap-3 mt-1 text-base">
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {profile.portfolio_url && (
            <a href={profile.portfolio_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Sections in tailored order */}
      {sectionOrder.map(section => {
        const node = renderSection(section)
        if (!node) return null
        return renderSectionWrapper ? renderSectionWrapper(section, node) : node
      })}
    </div>
  )
}
