"use client"
import { z } from "zod";
import {SignupScheamValidation} from '@/app/schemas/signupScheam'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect,useState} from "react"
import Router from "next/navigation";
import { useDebounceValue } from 'usehooks-ts'
import axios from 'axios'
import Link from "next/link";


const SignUpPage = () => {
  const [username, setusername] = useState('');
  const [UserNameMessage,setUserNameMessage]=useState('')
  const [isCheckingName, setisCheckingName] = useState(false)
  const [loading,setloading]=useState(false)
  const debUserName=useDebounceValue(username,300)
  //zod validation
  const form=useForm({
    resolver:zodResolver(SignupScheamValidation)
  })
  //checking username
  const checkUseName=async()=>{
    const headers = {
      'Content-Type': 'application/json' // Replace with your token
    };
    try {
      setisCheckingName(true)
      setUserNameMessage('')
      const response= axios.get(`/api/checking-username?username=${debUserName}`,{headers})
      setUserNameMessage(response.data.message)
    } catch (error) {
      setUserNameMessage
    }
  }
  useEffect(()=>{
    checkUseName()
  },
  [debUserName])
  return (
    <div>
    </div>
  )
}

export default SignUpPage
