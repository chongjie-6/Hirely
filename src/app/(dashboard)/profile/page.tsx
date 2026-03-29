
import ProfileForm from '@/components/profile/profile-form'
import { getProfile } from '@/services/profile/queries'

export default async function ProfilePage() {
  const profile = await getProfile()

  return <ProfileForm profile={profile} />
}
