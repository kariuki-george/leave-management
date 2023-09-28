'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/auth.state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';

import { siteConfig } from '@/config/site';
import { login } from '@/lib/fetchers';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export const LoginForm = () => {
  // Login Functionality
  const router = useRouter();
  const { setUser, setAuthToken } = useAuthStore();
  const { mutate, isLoading } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      if (process.env.NODE_ENV === 'development') {
        setUser(data.user);
        setAuthToken(data.authToken);
        toast({
          title: 'Successfully logged in',
          description: `Hi ${data?.user?.firstName}, welcome back🎉`,
        });
      } else {
        setUser(data);
        toast({
          title: 'Successfully logged in',
          description: `Hi ${data?.firstName}, welcome back🎉`,
        });
      }

      router.replace(siteConfig.nav.home);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  // Define form and validation

  const formSchema = z.object({
    email: z.string().email(),

    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex w-full max-w-[300px] flex-col gap-3 sm:max-w-[500px]"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>This is your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Password</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="Password"
                  {...field}
                  type="password"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button isLoading={isLoading} className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
