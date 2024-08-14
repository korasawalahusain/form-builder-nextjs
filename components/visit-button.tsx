'use client';

import { Button } from '@ui/button';
import { Skeleton } from '@ui/skeleton';
import React, { useEffect, useState } from 'react';

type VisitButtonProps = {
  formUrl: string;
};

export default function VisitButton({ formUrl }: VisitButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Skeleton>
        <Button className='w-[200px] opacity-0' />
      </Skeleton>
    ); // avoid rehydration errors

  const shareURL = `${window.location.origin}/submit/${formUrl}`;

  return (
    <Button
      className='w-[200px]'
      onClick={() => window.open(shareURL, '_blank')}
    >
      Visit
    </Button>
  );
}
