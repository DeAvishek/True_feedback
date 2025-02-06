"use client"
import React from 'react'
import {
  Card,
  CardDescription,
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
type MessageCardProps = {
  messageId: string,
  handleDeleteMessage:string
}
const MessageCard = ({ messageId, handleDeleteMessage }: MessageCardProps) => {
  return (
    <Card className="w-[300px] p-2">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm">{messageId}</CardTitle>
          <CardDescription className="text-xs">{handleDeleteMessage}</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default" size="sm">
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
              <AlertDialogAction >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  )
}

export default MessageCard
