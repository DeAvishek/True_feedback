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
           
                {user && <div className="flex items-center gap-4">
                    <span className="text-sm md:text-base">Welcome, {user.email}</span>
                    <Button 
                        onClick={() => signOut({callbackUrl:"https://true-feedback-hixr.onrender.com/sign-in"})} 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                        Log out
                    </Button>
                </div>}
        </div>
    </div>
</nav>
  )
}

export default Navbar
