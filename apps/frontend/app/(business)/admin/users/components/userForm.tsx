'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { adminUpdateUser, createUser } from '@/lib/fetchers';
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
import { Switch } from '@/components/ui/switch';
import { queryClient } from '@/lib/providers/reactquery.provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IUser } from '@/lib/types/user';
import { cn } from '@/lib/utils';

interface Props {
  user: IUser;
}

const NewUserForm = ({ user }: Props) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast({ title: 'Created employee successfully' });
    },
  });

  const updateUserFunc = useMutation({
    mutationFn: adminUpdateUser,
    onSuccess: () => {
      toast({ title: 'Updated user successfully!' });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (user) {
      updateUserFunc.mutate({
        ...values,
        employeeId: Number(values.employeeId),
      });

      return;
    }
    mutate({ ...values, employeeId: Number(values.employeeId) });
  }

  // Define form and validation

  const formSchema = z.object({
    employeeId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    isAdmin: z.boolean(),
    gender: z.enum(['M', 'F']),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user
      ? formSchema.parse({
          employeeId: user.userId.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          gender: user.gender,
        })
      : {
          employeeId: '',
          firstName: '',
          lastName: '',
          isAdmin: false,
          gender: 'M',
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
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Id</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={Number(field.value)}
                  placeholder="0000000000"
                  className={cn('h-12', Boolean(user) && ' cursor-not-allowed')}
                  onChange={Boolean(user) ? () => {} : field.onChange}
                />
              </FormControl>
              <FormDescription>This is the employee Id.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FirstName</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="John" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LastName</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Doe" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Admin</FormLabel>
                <FormDescription>
                  User will have admin permissions!
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          isLoading={isLoading || updateUserFunc.isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewUserForm;
