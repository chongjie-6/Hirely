'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '@/types/database'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
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
  title: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
    marginBottom: 10,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.6,
  },
})

interface CoverLetterPDFProps {
  coverLetter: string
  profile: Profile
}

export default function CoverLetterPDF({ coverLetter, profile }: CoverLetterPDFProps) {
  return (
    <Document>
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
        <Text style={styles.title}>Cover Letter</Text>
        <Text style={styles.body}>{coverLetter}</Text>
      </Page>
    </Document>
  )
}
