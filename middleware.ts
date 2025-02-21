import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // 需要保护的路由
  if (request.nextUrl.pathname.startsWith("/moe")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 已登录用户不能访问登录和注册页面
  if (session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/moe/endpoints", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/moe/:path*", "/login", "/register"]
} 