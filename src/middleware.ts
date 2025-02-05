import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"
export {default} from 'next-auth/middleware'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token= await getToken({req:request})  //due to handle by next-auth
    const url=request.nextUrl
    console.log("Middleware Token:", token ||"hey");

    if(token && (
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign_up')||
        url.pathname.startsWith('/verify')

    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && (url.pathname.startsWith('/dashboard'))){
        return NextResponse.redirect(new URL('/sign-in',request.url))
    }
    return NextResponse.next()
 
}
 
// See "Matching Paths"
export const config = {
  matcher: ['/sign-in','/sign_up','/dashboard/:path*','/verify']
}