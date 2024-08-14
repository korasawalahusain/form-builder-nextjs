'use client';

import { Button } from '@ui/button';
import { toast } from '@ui/use-toast';
import { Skeleton } from '@ui/skeleton';
import React, { useEffect, useState } from 'react';

type CopyUrlButtonProps = {
  formUrl: string;
};

export default function CopyUrlButton({ formUrl }: CopyUrlButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Skeleton>
        <Button className='mt-2 w-full opacity-0' />
      </Skeleton>
    ); // avoid rehydration errors

  const shareURL = `${window.location.origin}/submit/${formUrl}`;

  return (
    <Button
      className='mt-2 w-full'
      onClick={() => {
        navigator.clipboard.writeText(shareURL);
        toast({
          title: 'Copied!',
          description: 'Link copied to clipboard',
        });
      }}
    >
      Copy Link
    </Button>
  );
}
