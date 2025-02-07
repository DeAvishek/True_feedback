"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageCard from '@/components/MessageCard'
import Loader from '@/components/Loader'

const DashBoard = () => {
    const [isLoading, setisLoading] = useState(false);
    const [Messages, setMessages] = useState([]);
    const [ResponseMessage, setResponseMesssage] = useState('')
    const { data: session } = useSession()
    const[ProfileUrl,setProfileUrl]=useState('')
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
            setResponseMesssage('')
        }
    }

    

    useEffect(() => {
        const protocol = window.location.protocol;
        const host = window.location.host
        setProfileUrl(`${protocol}//${host}/u/${username}`);
    },[username])

    useEffect(() => {
        getmessages()
    }, [username])


    return (
        <div className="mt-10 w-full px-4">
            <input
                className="w-1/2 p-2 border border-gray-300 rounded-md ml-20 text-center"
                name="profileUrl"
                defaultValue={ProfileUrl}
            />
            <div className='flex flex-wrap gap-5 justify-center'>
                {isLoading ? (
                    <Loader />
                ) : (Messages.map((message, index) => (
                    <MessageCard key={index} messageId={message._id} handleDeleteMessage={message.content} />
                )))}
            </div>
        </div>
    )
}

export default DashBoard
