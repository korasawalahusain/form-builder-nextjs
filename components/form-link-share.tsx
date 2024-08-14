'use client';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { toast } from '@ui/use-toast';
import { Skeleton } from '@ui/skeleton';
import { ImShare } from 'react-icons/im';
import React, { useEffect, useState } from 'react';

type FormLinkShareProps = {
  formUrl: string;
};

export default function FormLinkShare({ formUrl }: FormLinkShareProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className='flex flex-grow items-center gap-4'>
        <Skeleton className='w-full'>
          <Input />
        </Skeleton>

        <Skeleton>
          <Button className='w-[250px]' />
        </Skeleton>
      </div>
    ); // avoid rehydration errors

  const shareURL = `${window.location.origin}/submit/${formUrl}`;

  return (
    <div className='flex flex-grow items-center gap-4'>
      <Input readOnly value={shareURL} />

      <Button
        className='w-[250px]'
        onClick={() => {
          navigator.clipboard.writeText(shareURL);
          toast({
            title: 'Copied!',
            description: 'Link copied to clipboard',
          });
        }}
      >
        <ImShare className='mr-2 h-4 w-4' />
        Share link
      </Button>
    </div>
  );
}
