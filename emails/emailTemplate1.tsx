import * as React from 'react';
// import { Html } from 'next/document';
interface VerificationEmailProps {
    username: string,
    otp: string

}

export function Email({ username, otp }: VerificationEmailProps) {
    return (
        <>
            <head>
                <title>Verification code</title>
            </head>
            <body>
                <h1>your verification code</h1>
                 <h5>welcome user {username}</h5>
                 <p>thanks for registering your code is {otp}</p>
            </body>
        </>
       
    );
}

export default Email;