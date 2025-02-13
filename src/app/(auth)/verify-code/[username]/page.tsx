'use client'
import { verifyCodeValidation} from '@/app/schemas/verifycodeScheam'// Fix filename spelling
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function Page() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [responseMessage, setResponseMessage] = useState('');
    const [isVerify, setIsVerify] = useState(false);

    // Define form schema based on Zod validation
    const formSchema = z.object({
        'verify-code': verifyCodeValidation
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'verify-code': '',
        },
    });

    const verifyHandle = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsVerify(true);
            const response = await axios.post('/api/verifycode', {
                'verify-code': data['verify-code'], // Match backend expected field name
                username: params.username
            });

            if (response.status === 200) {
                router.push('/sign-in');
            }
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
                setResponseMessage(
                    error.response?.data?.error || 
                    'An error occurred during verification'
                );
            }else{
                setResponseMessage("error occur during verification")
            }   
        } finally {
            setIsVerify(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-6">
                        Verify Your Account
                    </h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(verifyHandle)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="verify-code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter 6-digit code"
                                            {...field}
                                            disabled={isVerify}
                                            maxLength={6}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {responseMessage && (
                            <p className={`text-sm ${
                                responseMessage.toLowerCase().includes('success') 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                                {responseMessage}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                            disabled={isVerify}
                        >
                            {isVerify ? 'Verifying...' : 'Verify Account'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}