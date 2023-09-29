'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';

import { siteConfig } from '@/config/site';
import { assignUser } from '@/lib/fetchers';
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

// Form validation
const formSchema = z.object({
  email: z.string().trim().email(),
  employeeId: z.coerce.number().min(8).positive(),
  password: z.string().trim().min(8),
  confirmPassword: z.string().trim().min(8), // Might require extra validation
});

export const RegisterForm = () => {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      employeeId: 0,
      password: '',
      confirmPassword: '',
    },
  });

  // Submit
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: assignUser,
    onSuccess: (data: any) => {
      toast({
        title: 'Account created successfully!',
        description: `Welcome ${data?.name ?? 'User'}, let's log you in.`,
      });
      router.push(siteConfig.nav.auth.login);
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(values.email + 'ha');

    return;

    if (values.confirmPassword !== values.password) {
      return toast({
        title: 'An error occurred',
        description: 'Password and confirmPassword should be the same',
        variant: 'destructive',
      });
    }
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex w-full max-w-[300px]  flex-col  gap-3 sm:w-full "
      >
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Employee ID</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  type="number"
                  placeholder="Name"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your Employee Id.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />{' '}
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
                  type="password"
                  className="h-12"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>

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
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
