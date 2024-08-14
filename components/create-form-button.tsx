'use client';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@ui/dialog';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@ui/form';
import React from 'react';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { createForm } from '@actions';
import { toast } from '@ui/use-toast';
import { Textarea } from '@ui/textarea';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ImSpinner2 } from 'react-icons/im';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormSchemaType } from '@schemas';

type Props = {};

export default function CreateFormButton({}: Props) {
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormSchemaType) {
    try {
      const newFormId = await createForm(values);

      toast({
        title: 'Success',
        description: 'New form created successfully',
      });

      router.push(`builder/${newFormId}`);
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went wrong, please try again later',
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='group flex h-[190px] flex-col items-center justify-center gap-4 border border-dashed border-primary/70 hover:cursor-pointer hover:border-primary'
        >
          <BsFileEarmarkPlus className='h-8 w-9 text-muted-foreground group-hover:text-primary' />
          <p className='text-xl font-bold text-muted-foreground group-hover:text-primary'>
            Create new form
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Create a new form to start collecting responses
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              name='description'
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            className='mt-4 w-full'
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <ImSpinner2 className='animate-spin' />
            ) : (
              <span>Save</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
