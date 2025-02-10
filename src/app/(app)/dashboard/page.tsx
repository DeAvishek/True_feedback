"use client"
import React, { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageCard from '@/components/MessageCard'
import Loader from '@/components/Loader'
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { accptingMessage } from '@/app/schemas/isacceptingmesSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const DashBoard = () => {
    const form = useForm({
        resolver: zodResolver(accptingMessage)
    })
    const { setValue, register, watch } = form
    const [switchLoading, setswitchLoading] = useState(false);

    const isAcceptingMessage = watch("isAcceptingMessage")
    const [isLoading, setisLoading] = useState(false);
    const [Messages, setMessages] = useState([]);
    const [ResponseMessage, setResponseMesssage] = useState('')
    const { data: session } = useSession()
    const [ProfileUrl, setProfileUrl] = useState('')
    const username = session?.user.username
    console.log("provided session is", session?.user.username)  //Todo remove
    const getmessages = async () => {
        try {
            setisLoading(true);
            setResponseMesssage('')
            const response = await axios.get('/api/get-messages')
            if (response.status === 200) {
                setMessages(response.data.result);
                setResponseMesssage("Your message fectched...") //todo to remove
                console.log(response.data.result)  //Todo to remove
            }
        } catch (error: any) {
            setResponseMesssage(error.response.data.error)
            console.log(ResponseMessage) //Todo remove
        } finally {
            setisLoading(false)
        }
    }
    const acceptingStatus = useCallback(async () => {
        try {
            const response = await axios.get('/api/isacceptmessage')
            if (response.status === 200) {
                console.log(response.data.AcceptMessage)   //todo remove
                setValue("isAcceptingMessage", response.data.AcceptMessage,{ shouldValidate: true })
            }
        } catch (error:any) {
            console.log(error.response.data.error) //todo to remove
        }

    }, [setValue])

    useEffect(() => {
        const protocol = window.location.protocol;
        const host = window.location.host
        setProfileUrl(`${protocol}//${host}/u/${username}`);
    }, [username])

    useEffect(() => {
        getmessages()
        acceptingStatus()
        
    }, [username,acceptingStatus])
    

    const handleCopyToClipboard = () => {
        window.navigator.clipboard.writeText(ProfileUrl)
    }

    const setAcceptingStatus=async(newStatus: boolean)=>{
        
        try {
            setswitchLoading(true)
            const response=await axios.post('/api/acceptMessage',{isAcceptingMessage:newStatus})
            console.log(response.data.message) //todo to remove
            await acceptingStatus
        } catch (error:any) {
            console.log(error.response?.data?.error)
            await acceptingStatus()  //todo to remove
        }finally{
            setswitchLoading(false)
        }
          
    }

    return (
        <div className="mt-10 w-full px-4">
            <div className='flex item-center '>
                <input
                    className="w-1/2 p-2  border-gray-300 rounded-md ml-20 text-center"
                    name="profileUrl"
                    defaultValue={ProfileUrl}
                />
                <Button onClick={handleCopyToClipboard}>copy</Button>
            </div>
            <div>
                <Switch 
                {...register("isAcceptingMessage")}
                onCheckedChange={setAcceptingStatus}
                checked={isAcceptingMessage}
                disabled={switchLoading}/>
            </div>
            {Messages.length === 0 ? (
                <p>No content</p>
            ) : (
                <>
                    <div className='flex flex-wrap gap-5 justify-center'>
                        {isLoading ? (
                            <Loader />
                        ) : (Messages.map((message, index) => (
                            <MessageCard key={index} messageId={message._id} content={message.content} />
                        )))}
                    </div>
                </>
            )}

        </div>
    )
}

export default DashBoard
