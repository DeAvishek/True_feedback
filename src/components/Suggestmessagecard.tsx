"use client"
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
type suggestMessagesProp={
    message:string
}
import React from 'react'

const Suggestmessagecard = ({message}:suggestMessagesProp) => {
    return (
        <Card className="w-[350px] mt-5">
      <CardHeader>
        <CardTitle>{message}</CardTitle>
      </CardHeader>
      </Card>
    )
}

export default Suggestmessagecard
