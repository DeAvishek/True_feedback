
"use client"
import { z } from "zod";
import { SigninSchemaValidation } from '@/app/schemas/signinSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";


const SignInPage = () => {
  
  const [isSubmittingForm, setisSubmittingForm] = useState(false)
  const [ResponseMessage, setResponseMessage] = useState('')
  //debouncing the username
  const router=useRouter()
  //zod validation
  const form = useForm({
    resolver: zodResolver(SigninSchemaValidation),
    defaultValues: { email: "", password: "" }
  })
  //checking username
  const handleSignIn = async (data: z.infer<typeof SigninSchemaValidation>) => {
    try {
        setisSubmittingForm(true)
        const response=await signIn('credentials',{
          redirect:false,
          email:data.email,
          password:data.password
        })
        console.log(data.email)
        console.log(data.password)
        if(response?.error){
          console.log(response)
        }
        else if (response?.ok) {
          // If sign-in is successful, redirect to the dashboard
          setResponseMessage("Logged in successfully");
          router.push('/dashboard');
        }else{
          console.log(response)
          setResponseMessage("loggesd in successfully")
          router.push('/dashboard')
        }
    } catch (error:any) {
      console.log(error)
      setResponseMessage(error)
    }finally{
      setisSubmittingForm(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 " >
      <div className="w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md ">
        <div className="text-center">
          <h1 className="text-4xl font-extraboldd tracking-tight lg:text-5xl mb-6 ">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-8">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email"placeholder="email"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 " disabled={isSubmittingForm}>Sign In</Button>
          </form>
        </Form>
        <div>
          <p>Don't have an accoutn <Link href='/sign-up' className="text-blue-500">Sign Up</Link></p>
        </div>
      </div>

    </div>
  )
}

export default SignInPage

