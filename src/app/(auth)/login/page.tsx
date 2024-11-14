import AuthForm from '@/components/auth-form'
import H1 from '@/components/h1'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <main>
      <H1 className='text-center mb-5'>Log in</H1>
      <AuthForm type="login"/>
      <p className='mt-6 text-sm text-zinc-500'>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium">
          Sign up
        </Link>
      </p>
    </main>
  )
}

export default Page