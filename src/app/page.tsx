'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex mt-20 items-center justify-center">
      <h1 className="text-xl text-center ">Start your Anonymous adventure with Us..</h1>
      <Button  className="text-xl text-center ml-1" variant="default"><Link href="/sign-in">Start for free</Link></Button>
      </div>
    </div>
  );
}
