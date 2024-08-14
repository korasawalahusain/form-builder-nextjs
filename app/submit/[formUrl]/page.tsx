import React from 'react';
import { getFormContentByURL } from '@actions';
import { FormElementInstance, FormSubmit } from '@components';

type Props = {
  params: { formUrl: string };
};

export default async function SubmitPage({ params: { formUrl } }: Props) {
  const formContent: FormElementInstance[] = await getFormContentByURL(formUrl);

  return (
    <div className='flex w-full justify-center p-8'>
      <div className='flex h-full w-full max-w-[620px] flex-col gap-4 rounded border bg-background p-8 shadow-xl shadow-blue-700'>
        <FormSubmit formUrl={formUrl} content={formContent} />
      </div>
    </div>
  );
}
