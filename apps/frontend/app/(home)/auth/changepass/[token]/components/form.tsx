'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';

import { siteConfig } from '@/config/site';
import { changePassword } from '@/lib/fetchers';
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
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        title: 'Password has been reset successfully',
      });
      router.replace(siteConfig.nav.auth.login);
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
    mutate({ password: values.password, token });
  }

  // Define form and validation

  const formSchema = z.object({
    password: z.string().trim().min(8),
    confirmPassword: z.string().trim().min(8),
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

        <Button isLoading={isLoading} className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
