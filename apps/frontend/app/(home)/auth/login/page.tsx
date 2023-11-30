import React from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/app/(home)/auth/login/components/login';

const Login = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <section className="flex w-full  flex-col items-center justify-between gap-3 pt-10">
        <h1 className="text-2xl font-bold">Log in to your account</h1>
        <LoginForm />
        <span className="flex items-center">
          Don&apos;t have an account?{' '}
          <Link href={siteConfig.nav.auth.register}>
            <Button variant={'link'}>Create free Account</Button>
          </Link>
        </span>
        or
        <span className=" w-full  max-w-[300px] items-center gap-3  sm:max-w-[500px]">
          <Link href={siteConfig.nav.auth.forgotPass}>
            <Button variant={'outline'} className="w-full">
              Forgot Password?
            </Button>
          </Link>
        </span>
      </section>
      <section className="absolute bottom-4 left-4 flex flex-col items-baseline rounded-sm border p-3">
        <span className="mb-2 w-full border-b pb-1">Test Credentials</span>
        <span></span>
        <code className="text-cmd">Email: johndoe@email.com</code>
        <code>Password: tttttttt</code>
      </section>
    </div>
  );
};

export default Login;
