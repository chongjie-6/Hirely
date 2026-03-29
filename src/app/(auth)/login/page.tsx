import LoginForm from '@/components/auth/LoginForm'
import { getUser } from '@/services/user/queries'
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { isLoggedIn } = await getUser();
  if (isLoggedIn) redirect("/dashboard")
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}
