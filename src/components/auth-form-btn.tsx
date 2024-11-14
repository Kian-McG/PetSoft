"use client";
import { Button } from './ui/button'
import { useFormStatus } from 'react-dom';

const AuthFormBtn = ({type}: {
    type: "login" | "signup";
}) => {
    const {pending} = useFormStatus()
  return (
    <Button disabled={pending} className="mt-4" type="submit">
        {type === "login" ? "Log in" : "Sign up"}
      </Button>
  )
}

export default AuthFormBtn