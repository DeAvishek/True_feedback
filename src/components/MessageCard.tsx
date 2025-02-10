"use client"
import { useState } from 'react'
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import axios from 'axios'
import AlertBox from './Alert'
type MessageCardProps = {
  messageId: string,
  content: string
}
const MessageCard = ({ messageId, content }: MessageCardProps) => {
  const [isLoading, setisLoading] = useState(false)
  const [responseMessage, setResponseMesssage] = useState('')
  const [isdeleted,setisdeleted]=useState(false)
  const handleDeleteMessage = async () => {
    try {
      setisLoading(true);
      setResponseMesssage('');
      setisdeleted(true)
      const response = await axios.delete(`/api/delete-message/${messageId}`)
      if (response.status === 200) {
        console.log("Message deleted success fully with id ", messageId) //todo to remove
        setResponseMesssage(response.data.message)
      }
    } catch (error: any) {
      console.log(error);  //todo to remove
      setResponseMesssage(error.response.data.error)

    } finally {
      setisLoading(false)
      setisdeleted(false)
    }
  }
  return (
    <>
      <Card className="w-[300px] p-2">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">{content}</CardTitle>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                X
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMessage} >Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      </Card>
      {isdeleted && <AlertBox message={responseMessage}/>}
    </>
  )
}

export default MessageCard
