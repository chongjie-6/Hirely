import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function EmailConfirmationPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Check your email</CardTitle>
            <CardDescription>
              We sent you a confirmation link. Click it to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive an email? Check your spam folder or try signing up again.
            </p>
            <Button variant="outline" className="w-full">
              <Link href="/signup">Back to sign up</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
