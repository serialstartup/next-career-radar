import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Public paths that don't require Supabase
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/onboarding']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/') ||
    request.nextUrl.pathname.startsWith('/_next')
  )

  // If Supabase is not configured, allow public paths
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isPublicPath) {
      return supabaseResponse
    }
    // Redirect to home for protected paths when Supabase is not configured
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/dashboard', '/cv', '/market', '/matches', '/insights', '/settings']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Auth pages redirect if logged in
  const authPaths = ['/login', '/register', '/forgot-password']
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
