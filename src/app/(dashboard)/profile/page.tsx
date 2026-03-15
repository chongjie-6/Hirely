import { getProfile } from '@/services/queries'
import ProfileForm from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const profile = await getProfile()

  return <ProfileForm profile={profile} />
}
