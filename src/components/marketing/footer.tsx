'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react'

export function MarketingFooter() {
  const t = useTranslations('footer')

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">{t('brand.name')}</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('brand.description')}
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Pages Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('pages.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('pages.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('pages.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('pages.demo')}
                </Link>
              </li>
              <li>
                <Link
                  href="/process"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('pages.process')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('legal.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('legal.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('legal.refund')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('contact.title')}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${t('contact.email')}`}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {t('contact.email')}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/972000000000"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  {t('contact.whatsapp')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Business Control. {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
