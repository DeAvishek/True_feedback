"use client"
import React, { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageCard from '@/components/MessageCard'
import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react';
type Message={
    _id:string,
    content:string
}
const DashBoard = () => {

    const [copyButtonText, setCopyButtonText] = useState("Copy")
    const [isLoading, setisLoading] = useState(false);
    const [Messages, setMessages] = useState<Message[]>([]);
    const { data: session } = useSession()
    const [ProfileUrl, setProfileUrl] = useState('')
    const username = session?.user.username

    const getmessages = async () => {
        try {
            setisLoading(true);
            const response = await axios.get('/api/get-messages')
            if (response.status === 200) {
                setMessages(response.data.result);
                console.log(response.data.result)  //Todo to remove
            }
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
                console.log(error.response?.data?.error ||"An error occured") //todo to remove
            }
             console.log("An unexpected error") //Todo remove
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

        } catch (error) {
            console.log("failed to copy ", error)
        }

    }, [ProfileUrl])

    // const setAcceptingStatus = async () => {

    //     try {
    //         const response = await axios.post('/api/isacceptmessage')
    //         console.log(response.data.message) //todo to remove
    //     } catch (error:unknown) {
    //         if(axios.isAxiosError(error)){
    //             console.log(error.response?.data?.error ||"An error Occured") 
    //         }
    //         console.log("An unexpected error occured")
           
    //     } 

    // }




    useEffect(() => {
        getmessages()

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
