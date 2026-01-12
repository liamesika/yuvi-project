import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/he', request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(he|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}
