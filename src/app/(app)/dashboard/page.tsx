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
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
const DashBoard = () => {
    const form = useForm({
        resolver: zodResolver(accptingMessage)
    })
    const [switchLoading, setswitchLoading] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState("Copy")
    const [isLoading, setisLoading] = useState(false);
    const [Messages, setMessages] = useState([]);
    const [ResponseMessage, setResponseMesssage] = useState('')
    const { data: session } = useSession()
    const [ProfileUrl, setProfileUrl] = useState('')
    const username = session?.user.username
    const [status, setstatus] = useState('')

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

    useEffect(() => {
        const protocol = window.location.protocol;
        const host = window.location.host
        setProfileUrl(`${protocol}//${host}/user/${username}`);
    }, [username])


    const handleCopyToClipboard = useCallback(() => {
        try {
            window.navigator.clipboard.writeText(ProfileUrl)
            setCopyButtonText("Copied")
            setTimeout(() => {
                setCopyButtonText("Copy ")
            }, 1000);

        } catch (error: any) {
            console.log("failed to copy ", error)
        }

    }, [ProfileUrl])

    const setAcceptingStatus = async () => {

        try {
            setswitchLoading(true)
            const response = await axios.post('/api/isacceptmessage')
            console.log(response.data.message) //todo to remove
        } catch (error: any) {
            console.log(error.response?.data?.error) //todo to remove
        } finally {
            setswitchLoading(false)
        }

    }

    const acceptingStatus = useCallback(async () => {
        try {
            const response = await axios.get('/api/isacceptmessage')
            if (response.status === 200) {
                console.log(response.data.AcceptMessage)   //todo remove
                setstatus(response.data.AcceptMessage)
            }
        } catch (error: any) {
            console.log(error.response.data.error) //todo to remove
        }

    }, [getmessages, setAcceptingStatus])


    useEffect(() => {
        getmessages()
        acceptingStatus()

    }, [username])
    return (
        <div className="mt-10 w-full px-4 flex flex-col items-center">
            <div className="flex items-center w-full max-w-2xl gap-3 bg-gray-100 p-4 rounded-lg shadow-md">
                <input
                    className="flex-1 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="profileUrl"
                    defaultValue={ProfileUrl}
                    readOnly
                />
                <Button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    onClick={handleCopyToClipboard}
                >
                    {copyButtonText}
                </Button>
            </div>
            <p className="mt-3 text-gray-600 text-sm">
                Visit this URL to send Anonymous Feedback to <b className="text-black">{username}</b>
            </p>

            {Messages.length === 0 ? (
                <p>No content</p>
            ) : (
                <>
                    <Switch
                        onChange={acceptingStatus}
                        onCheckedChange={setAcceptingStatus} />
                    Accepting Message{status ? (<p>On</p>) : (<p>Off</p>)}
                    <Button  onClick={getmessages} className='mt-2 '>
                        <RefreshCw />
                    </Button>
                    <div className='flex flex-wrap gap-5 justify-center mt-10' >

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
