'use client';

import { useDesigner } from '@providers';
import { FormElements } from './form-elements';
import React, { PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@ui/dialog';

type Props = {};

export default function PreviewFormButton({
  children,
}: PropsWithChildren<Props>) {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='flex h-screen max-h-screen w-screen max-w-full flex-grow flex-col gap-0 p-0'>
        <div className='border-b px-4 py-2'>
          <p className='text-lg font-bold text-muted-foreground'>
            Form Preview
          </p>
          <p className='text-sm text-muted-foreground'>
            This is how your form will look like to the user
          </p>
        </div>
        <div className='flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent bg-[url(/paper.svg)] p-4 dark:bg-[url(/paper.dark.svg)]'>
          <div className='flex h-full w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-6'>
            {elements.map((element, index) => {
              const FormComponent = FormElements[element.type].formComponent;

              return <FormComponent key={index} element={element} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
