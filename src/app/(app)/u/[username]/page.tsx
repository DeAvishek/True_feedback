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
const Page = () => {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [responseMessage, setresponseMessage] = useState('');
    const [suggestMessages, setsuggestMessages] = useState('');
    const [loadingForSuggestMessage, setloadingForSuggestMessage] = useState(false)
    const [messageArr, setmessageArr] = useState([])
    const params = useParams()
    const username = params.username
    const messageScheam = z.object({
        'content': messageValidation
    })
    const form = useForm({
        resolver: zodResolver(messageScheam),
        defaultValues: {
            'content': "",
        },
    })
    const handlePostMessage = async (data: z.infer<typeof messageValidation>) => {
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
        } catch (error: any) {
            setresponseMessage(error.response.data.error || 'Something went wrong')
            console.log(error.response.data.error)//todo remove

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
        } catch (error: any) {
            setsuggestMessages(error.response.data.error)
        } finally {
            setloadingForSuggestMessage(false)
        }

    }
    useEffect(() => {
        getSuggetMessage()
    }, [])

    return (
        <>
            <div className="flex justify-center items-center min-h-screen">
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
                            (<p className='text-red-500'></p>)
                        }
                        <Button type="submit" className="w-full">Send</Button>
                    </form>
                </Form>

            </div>
            {loadingForSuggestMessage ? (
                <p>Getting...</p>
            ) : messageArr.length > 0 ? (
                messageArr.map((message, index) => (
                    <p key={index}>{message}</p>
                ))
            ) : (
                <p>No suggestions available</p> // Handle empty state
            )}
        </>

    )
}

export default Page
