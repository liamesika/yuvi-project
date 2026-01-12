'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FadeIn } from '@/components/motion'
import { localeNames, type Locale } from '@/i18n/config'

export default function ProfilePage() {
  const t = useTranslations('profile')
  const locale = useLocale() as Locale
  const router = useRouter()
  const { data: session, update } = useSession()

  const [name, setName] = useState(session?.user?.name || '')
  const [preferredLocale, setPreferredLocale] = useState(
    session?.user?.preferredLocale || locale
  )
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, preferredLocale }),
      })

      if (res.ok) {
        await update({ name, preferredLocale })
        setMessage('Profile updated successfully')

        // If locale changed, redirect to new locale
        if (preferredLocale !== locale) {
          document.cookie = `NEXT_LOCALE=${preferredLocale};path=/;max-age=31536000`
          router.replace('/app/profile', { locale: preferredLocale as Locale })
        }
      }
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <FadeIn>
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('title')}</h1>
      </FadeIn>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('personalInfo.name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('personalInfo.email')}</Label>
                <Input id="email" value={session?.user?.email || ''} disabled />
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>{t('preferences.title')}</CardTitle>
              <CardDescription>{t('preferences.languageDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="language">{t('preferences.language')}</Label>
                <Select value={preferredLocale} onValueChange={setPreferredLocale}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="he">{localeNames.he}</SelectItem>
                    <SelectItem value="en">{localeNames.en}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {message && (
          <div className="p-3 rounded-lg bg-success/10 text-success text-sm">{message}</div>
        )}

        <FadeIn delay={0.3}>
          <Button type="submit" size="lg" isLoading={isLoading}>
            {t('save')}
          </Button>
        </FadeIn>
      </form>
    </div>
  )
}
