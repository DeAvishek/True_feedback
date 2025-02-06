"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageCard from '@/components/MessageCard'

const DashBoard = () => {
    const [isLoading, setisLoading] = useState(false);
    const [Messages, setMessages] = useState([]);
    const [ResponseMessage, setResponseMesssage] = useState('')

    const getmessages = async () => {
        try {
            setisLoading(true);
            setResponseMesssage('')
            const response = await axios.get('/api/get-messages')
            if (response.status === 200) {
                setMessages(response.data.result);
                setResponseMesssage("Your message fectched...") //todo to remove
                console.log(response.data.result)  //Todo to remove
                console.log(Messages)
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
        getmessages()
    }, [])

    return (
        <div>
            <div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (Messages.map((messsage,index)=>(
                    <MessageCard key={index} messageId={messsage._id} handleDeleteMessage={messsage.content}/>
                )))}
            </div>
        </div>
    )
}

export default DashBoard
