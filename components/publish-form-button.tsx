'use client';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from '@ui/alert-dialog';
import { toast } from '@ui/use-toast';
import { publishFormById } from '@actions';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useTransition } from 'react';

type Props = {
  id: number;
};

export default function PublishFormButton({
  id,
  children,
}: PropsWithChildren<Props>) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      await publishFormById(id);

      toast({
        title: 'Success',
        description: 'Your form is now available to the public',
      });

      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went Wrong!',
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing you will not be able
            to edit this form. <br />
            <br />
            <span className='font-medium'>
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='gap-2'
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              startTransition(publishForm);
            }}
          >
            Proceed {loading && <FaSpinner className='animate-spin' />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
