import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';

export default function IndexPage() {
  return (
    <div className="w-full    ">
      {/* Small Hero section */}

      <div className="  mt-10 flex h-full w-full flex-col  items-center justify-around gap-3  text-center">
        <h1 className="text-[50px]">Leave Management System</h1>
        <section className="flex gap-3">
          <Link href={siteConfig.nav.auth.register}>
            <Button>Sign Up It&apos;s Free</Button>
          </Link>
          <Link href={siteConfig.nav.auth.login}>
            <Button variant={'secondary'}>Welcome Back</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
