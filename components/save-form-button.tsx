'use client';

import { Button } from '@ui/button';
import { toast } from '@ui/use-toast';
import { useDesigner } from '@providers';
import { HiSaveAs } from 'react-icons/hi';
import { updateFormById } from '@actions';
import { FaSpinner } from 'react-icons/fa';
import React, { useTransition } from 'react';

type Props = {
  id: number;
};

export default function SaveFormButton({ id }: Props) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  async function saveForm() {
    try {
      await updateFormById(id, elements);

      toast({
        title: 'Success',
        description: 'Your form has been saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went Wrong!',
      });
    }
  }

  return (
    <Button
      variant='outline'
      className='gap-2'
      onClick={() => startTransition(saveForm)}
    >
      <HiSaveAs className='h-4 w-4' />
      Save
      {loading && <FaSpinner className='animate-spin' />}
    </Button>
  );
}
