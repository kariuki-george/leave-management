'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';

import { createOffDay, updateOffDay } from '@/lib/fetchers';
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
import { queryClient } from '@/lib/providers/reactquery.provider';
import { format, startOfTomorrow } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { IOffDay } from '@/lib/types/offDays';
import { Switch } from '@/components/ui/switch';

interface Props {
  offDay?: IOffDay;
}

const HolidayForm = ({ offDay }: Props) => {
  const createHoliday = useMutation({
    mutationFn: createOffDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offDays'] });
      toast({ title: 'Created holiday successfully' });
    },
  });

  const updateHoliday = useMutation({
    mutationFn: updateOffDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offDays'] });
      toast({ title: 'Updated holiday successfully' });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (offDay) {
      updateHoliday.mutate({
        ...values,
        date: format(values.date, 'yyyy-MM-dd'),

        offDayId: offDay.offDayId,
        recurring: Boolean(values.recurring),
      });
      return;
    }
    createHoliday.mutate({
      name: values.name,
      date: format(values.date, 'yyyy-MM-dd'),
      recurring: Boolean(values.recurring),
    });
  }

  // Define form and validation

  const formSchema = z.object({
    name: z.string().min(3),
    date: z.date().min(startOfTomorrow()),
    recurring: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: offDay
      ? formSchema.parse({
          name: offDay?.name,
          date: new Date(offDay?.date),
          recurring: offDay.recurring,
        })
      : { name: '', date: startOfTomorrow(), recurring: false },
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
                <Input className="h-12" placeholder="Christmas" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the holiday.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <div className={'flex w-full gap-2'}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={'w-full justify-start text-left font-normal'}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span className="w-full">Pick the Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromDate={startOfTomorrow()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Recurring</FormLabel>
                <FormDescription>
                  Does the holiday occur every year!
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
          isLoading={createHoliday.isLoading || updateHoliday.isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default HolidayForm;
