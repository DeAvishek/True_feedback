import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"
import path from 'path'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token= await getToken({req:request})  //due to handle by next-auth
    const url=request.nextUrl

    if(token && (
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign_up')||
        url.pathname.startsWith('/')||
        url.pathname.startsWith('/verify')

    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in','/dashboard/:path*','/verify']
}