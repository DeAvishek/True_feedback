"use client"
import { z } from "zod";
import { SignupScheamValidation } from '@/app/schemas/signupScheam'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation";
import { useDebounceValue } from 'usehooks-ts'
import axios from 'axios'
import Link from "next/link";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const SignUpPage = () => {
  const [username, setusername] = useState('');
  const [UserNameMessage, setUserNameMessage] = useState('')
  const [isCheckingName, setisCheckingName] = useState(false)
  const [isSubmittingForm, setisSubmittingForm] = useState(false)
  const [ResponseMessage, setResponseMessage] = useState('')
  const debUserName = useDebounceValue(username, 300) //debouncing the username

  //zod validation
  const form = useForm({
    resolver: zodResolver(SignupScheamValidation)
  })
  //checking username
  const checkUseName = async () => {
    const headers = {
      'Content-Type': 'application/json'
    };
    try {
      setisCheckingName(true)
      setUserNameMessage('')
      const response = axios.get(`/api/checking-username?username=${debUserName}`, { headers })
      setUserNameMessage(response.data.message)
    } catch (error: any) {
      setUserNameMessage(error.message)
    } finally {
      setisCheckingName(false)
    }
  }
  const handleSignUp = async (data: z.infer<typeof SignupScheamValidation>) => {
    try {
      setisSubmittingForm(true)
      const response = await axios.post('/api/sign-up', data);
      if (response.status === 200) {
        setResponseMessage(response.data.message);
        redirect(`/verify-code/${username}`)
      }
      setisSubmittingForm(false)
    } catch (error: any) {
      setResponseMessage(error.response.data.error)
    }
  }
  useEffect(() => {
    checkUseName()
  },
    [debUserName])
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
          <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-8">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setusername(e.target.value)
                      }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="eamil"
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
            <Button type="submit" className="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 " disabled={isSubmittingForm}>Sign up</Button>
          </form>
        </Form>
        <div>
          <p>Already Have an Account <Link href='/sign-in'>Sign in</Link></p>
        </div>
      </div>

    </div>
  )
}

export default SignUpPage
