
"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { useState } from 'react'
import { messageValidation } from '@/app/schemas/messageScheam'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Suggestmessagecard from '@/components/Suggestmessagecard'
import { RefreshCw } from 'lucide-react';
const Page = () => {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [responseMessage, setresponseMessage] = useState('');
    const [loadingForSuggestMessage, setloadingForSuggestMessage] = useState(false)
    const [messageArr, setmessageArr] = useState([])
    const params = useParams()
    const username = params.username
    const messageScheam = z.object({
        'content': messageValidation
    })
    const form = useForm<z.infer<typeof messageScheam>>({
        resolver: zodResolver(messageScheam),
        defaultValues: {
            'content': "",
        },
    })
    const handlePostMessage = async (data: z.infer<typeof messageScheam>) => {
        try {
            setIsSubmittingForm(true)
            setresponseMessage('')
            const response = await axios.post('/api/send-message', {
                'content': data['content'],
                 user: username
            }

            )
            if (response.status === 200) {
                setresponseMessage(response.data.message);
                console.log(response.data.message) //todo remove
                form.reset()
            }
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
                setresponseMessage(error.response?.data?.error || 'User is not accepting message')
                console.log(error.response?.data?.error)//todo remove
            }else{
                setresponseMessage("somthing went to wrong")
            }
            

        } finally {
            setIsSubmittingForm(false);
        }
    }
    const getSuggetMessage = async () => {
        try {
            setloadingForSuggestMessage(true)
            const response = await axios.get('/api/suggest-message')
            if (response.status === 200) {
                setmessageArr(response.data.message.split("|"))
            }
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
                console.log(error.response?.data?.error ||"getting error from ai")
            }else{
                console.log("GeniAi error")
            }
            
        } finally {
            setloadingForSuggestMessage(false)
        }

    }
    useEffect(() => {
       if(username) getSuggetMessage()
    }, [username])

    return (
        <>
            <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePostMessage)} className="space-y-8 bg-white p-6 shadow-lg rounded-lg w-96">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Message" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {responseMessage.includes("Message send successfully") ?
                                (<p className='text-green-500'>Message send successfully</p>) :
                                (<p className='text-red-500'>{responseMessage}</p>)
                            }
                            <Button type="submit" className="w-full" disabled={isSubmittingForm}>Send</Button>
                        </form>
                    </Form>

                </div>
                <div className='ml-5'>
                    <div className='text-white-500 bg-pink-500 font-bold w-full max-w-48 ' >AI powred Suggestions</div>
                    <div>
                      <Button onClick={getSuggetMessage} className='mt-2'>
                        <RefreshCw/>
                      </Button>
                    </div>
                    {loadingForSuggestMessage ? (
                        <p>Getting...</p>
                    ) : messageArr.length > 0 ? (
                        messageArr.map((message, index) => (
                            <Suggestmessagecard key={index} message={message}/>
                        ))
                    ) : (
                        <p>No suggestions available</p> // Handle empty state
                    )}
                </div>
            </div>
        </>

    )
}

export default Page
