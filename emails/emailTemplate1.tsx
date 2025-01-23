import * as React from 'react';
import { Html } from 'next/document';
interface verificationEmailprops {
    username: string,
    otp: string

}

export function Email({ username, otp }: verificationEmailprops) {
    return (
        <Html lang="en">
            <head>
                <title>Verification code</title>
            </head>
            <body>
                <h1>your verification code</h1>
                 <h5>welcome user {username}</h5>
                 <p>thans for registering your code is {otp}</p>
            </body>
        </Html>
    );
}

export default Email;