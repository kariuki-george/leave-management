'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/auth.state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
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

interface Props {
  token: string;
}

export const ChangePassForm = ({ token }: Props) => {
  // Login Functionality
  const router = useRouter();
  const { setUser, setAuthToken } = useAuthStore();
  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      setUser(data.user);
      setAuthToken(data.authToken);
      toast({
        title: 'Successfully logged in',
        description: `Hi ${data?.user?.firstName}, welcome back🎉`,
      });
      router.replace(siteConfig.nav.dashboard);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword != values.password) {
      toast({
        variant: 'destructive',
        title: 'Confirm password should match the new password',
      });
      return;
    }
    mutate(values);
  }

  // Define form and validation

  const formSchema = z.object({
    password: z.string().min(8),

    confirmPassword: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: '',
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="New Password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormDescription>This is your new password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="Confirm Password"
                  {...field}
                  type="password"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
