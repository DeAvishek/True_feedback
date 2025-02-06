"use client"
import React from 'react'
import { useSession ,signOut} from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button';
import Link from 'next/link';
const Navbar = () => {
    const {data:session}=useSession();
    const user=session?.user as User 
  return (
    <nav className="bg-gray-900 text-white py-4 px-6 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">Mystrey Message</h1>
        </Link>
        <div>
            {session ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm md:text-base">Welcome, {user.email}</span>
                    <Button 
                        onClick={() => signOut()} 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                        Log out
                    </Button>
                </div>
            ) : (
                <Link href="/sign-in">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Sign In
                    </Button>
                </Link>
            )}
        </div>
    </div>
</nav>
  )
}

export default Navbar
