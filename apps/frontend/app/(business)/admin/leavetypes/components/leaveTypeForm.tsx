'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { createLeaveType } from '@/lib/fetchers';
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
import { ILeaveType } from '@/lib/types/leaveTypes';

interface Props {
  leaveType?: ILeaveType;
}

const LeaveTypeForm = ({ leaveType }: Props) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: createLeaveType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
      toast({ title: 'Created leaveType successfully' });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (leaveType) {
      // Update
      return;
    }
    mutate(values);
  }

  // Define form and validation

  const formSchema = z.object({
    name: z.string().min(3),
    maxDays: z.coerce.number().positive().lt(365).optional(),
    isAnnualLeaveBased: z.boolean(),
    code: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: leaveType?.name ?? '',
      maxDays: leaveType?.maxDays ?? 1,
      code: leaveType?.code ?? '',
      isAnnualLeaveBased: leaveType?.isAnnualLeaveBased ?? true,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Sick Leave" {...field} />
              </FormControl>
              <FormDescription>This is the name of the leave.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="SL" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAnnualLeaveBased"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>IsAnnualLeaveBased</FormLabel>
                <FormDescription>
                  Will utilise the annual leave days!
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
        <FormField
          control={form.control}
          disabled={form.getValues().isAnnualLeaveBased}
          name="maxDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MaxDays</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="h-12"
                  placeholder="10"
                  {...field}
                />
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

export default LeaveTypeForm;
