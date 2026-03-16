'use client'

import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import type { TailoredContent, Profile } from '@/types/database'
import { formatDateRange } from '@/lib/utils'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    fontSize: 9,
    color: '#555',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 2,
    fontSize: 9,
  },
  link: {
    color: '#2563eb',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  entryDate: {
    fontSize: 9,
    color: '#666',
  },
  entryCompany: {
    fontStyle: 'italic',
    fontSize: 9,
    color: '#555',
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  skillsText: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  projectTech: {
    fontSize: 8,
    color: '#666',
  },
})

interface ResumePDFProps {
  content: TailoredContent
  profile: Profile
  showSummary?: boolean
  includeCoverLetter?: boolean
}

export default function ResumePDF({ content, profile, showSummary = true, includeCoverLetter = false }: ResumePDFProps) {
  const sectionOrder = content.sectionOrder ?? ['summary', 'experience', 'skills', 'projects', 'education']

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return (content.summary && showSummary) ? (
          <View key="summary">
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{content.summary}</Text>
          </View>
        ) : null

      case 'experience':
        return content.experiences?.length > 0 ? (
          <View key="experience">
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {content.experiences.map((exp, i) => (
              <View key={exp.id || i}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                  </Text>
                </View>
                <Text style={styles.entryCompany}>{exp.company}</Text>
                {exp.description && (
                  <Text style={styles.entryDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null

      case 'education':
        return content.education?.length > 0 ? (
          <View key="education">
            <Text style={styles.sectionTitle}>Education</Text>
            {content.education.map((edu, i) => (
              <View key={edu.id || i} style={{ marginBottom: 4 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {edu.degree && edu.field_of_study
                      ? `${edu.degree} in ${edu.field_of_study}`
                      : edu.degree || edu.field_of_study || 'Degree'}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(edu.start_date, edu.end_date)}
                  </Text>
                </View>
                <Text style={styles.entryCompany}>
                  {edu.school}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </Text>
              </View>
            ))}
          </View>
        ) : null

      case 'skills':
        return (content.skills?.technical?.length > 0 || content.skills?.soft?.length > 0) ? (
          <View key="skills">
            <Text style={styles.sectionTitle}>Skills</Text>
            {content.skills.technical?.length > 0 && (
              <Text style={styles.skillsText}>
                <Text style={styles.skillLabel}>Technical: </Text>
                {content.skills.technical.join(', ')}
              </Text>
            )}
            {content.skills.soft?.length > 0 && (
              <Text style={styles.skillsText}>
                <Text style={styles.skillLabel}>Soft Skills: </Text>
                {content.skills.soft.join(', ')}
              </Text>
            )}
          </View>
        ) : null

      case 'projects':
        return content.projects?.length > 0 ? (
          <View key="projects">
            <Text style={styles.sectionTitle}>Projects</Text>
            {content.projects.map((proj, i) => (
              <View key={proj.id || i} style={{ marginBottom: 4 }}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <Text style={styles.entryTitle}>{proj.name}</Text>
                  {proj.technologies?.length > 0 && (
                    <Text style={styles.projectTech}>({proj.technologies.join(', ')})</Text>
                  )}
                </View>
                {proj.description && (
                  <Text style={styles.entryDescription}>{proj.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null

      default:
        return null
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <View style={styles.contactRow}>
            {profile.email && <Text>{profile.email}</Text>}
            {profile.email && profile.phone && <Text>·</Text>}
            {profile.phone && <Text>{profile.phone}</Text>}
            {(profile.email || profile.phone) && profile.location && <Text>·</Text>}
            {profile.location && <Text>{profile.location}</Text>}
          </View>
          <View style={styles.linksRow}>
            {profile.linkedin_url && (
              <Link src={profile.linkedin_url} style={styles.link}>LinkedIn</Link>
            )}
            {profile.portfolio_url && (
              <Link src={profile.portfolio_url} style={styles.link}>Portfolio</Link>
            )}
          </View>
        </View>

        {/* Sections */}
        {sectionOrder.map(section => renderSection(section))}
      </Page>

      {includeCoverLetter && content.coverLetter && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.name}>{profile.full_name}</Text>
            <View style={styles.contactRow}>
              {profile.email && <Text>{profile.email}</Text>}
              {profile.email && profile.phone && <Text>·</Text>}
              {profile.phone && <Text>{profile.phone}</Text>}
              {(profile.email || profile.phone) && profile.location && <Text>·</Text>}
              {profile.location && <Text>{profile.location}</Text>}
            </View>
          </View>
          <Text style={styles.sectionTitle}>Cover Letter</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.6 }}>{content.coverLetter}</Text>
        </Page>
      )}
    </Document>
  )
}
