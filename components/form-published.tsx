import React from 'react';
import Link from 'next/link';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Form } from '@prisma/client';
import CopyUrlButton from './copy-url-button';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

type Props = {
  form: Form;
};

export default function FormPublished({ form }: Props) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      {/* <Confetti /> */}

      <div className='max-w-[620px]'>
        <h1 className='mb-10 border-b pb-2 text-center text-4xl font-bold text-primary'>
          🎊🎊 Form Published 🎊🎊
        </h1>
        <h2 className='text-2xl'>Share this form</h2>
        <h3 className='border-b pb-10 text-xl text-muted-foreground'>
          Anyone with the link can view and submit the form
        </h3>
        <div className='my-4 flex w-full flex-col items-center gap-2 border-b pb-4'>
          <Input className='w-full' readOnly value={form.shareURL} />
          <CopyUrlButton formUrl={form.shareURL} />
        </div>
        <div className='flex justify-between'>
          <Button asChild variant='link'>
            <Link href='/' className='gap-2'>
              <BsArrowLeft />
              Go back home
            </Link>
          </Button>
          <Button asChild variant='link'>
            <Link href={`/forms/${form.id}`} className='gap-2'>
              Form Details
              <BsArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
