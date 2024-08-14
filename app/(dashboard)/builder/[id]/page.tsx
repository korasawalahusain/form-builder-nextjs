import {
  Designer,
  FormPublished,
  SaveFormButton,
  DesignerSidebar,
  PublishFormButton,
  PreviewFormButton,
} from '@components';
import React from 'react';
import { Button } from '@ui/button';
import { Form } from '@prisma/client';
import { getFormById } from '@actions';
import { DesignerProvider } from '@providers';
import { MdOutlinePublish, MdPreview } from 'react-icons/md';

type Props = {
  params: { id: string };
};

export default async function BuilderPage({ params: { id } }: Props) {
  const form: Form = await getFormById(Number(id));

  if (form.published) return <FormPublished form={form} />;

  return (
    <DesignerProvider formContent={form.content}>
      <div className='flex h-full w-full flex-col'>
        <nav className='flex items-center justify-between gap-3 border-b-2 p-4'>
          <h2 className='truncate font-medium'>
            <span className='mr-2 text-muted-foreground'>Form:</span>
            {form.name}
          </h2>
          <div className='flex items-center gap-2'>
            <PreviewFormButton>
              <Button variant='outline' className='gap-2'>
                <MdPreview className='h-6 w-6' />
                Preview
              </Button>
            </PreviewFormButton>
            {!form.published && (
              <>
                <SaveFormButton id={form.id} />
                <PublishFormButton id={form.id}>
                  <Button className='gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white'>
                    <MdOutlinePublish className='h-4 w-4' />
                    Publish
                  </Button>
                </PublishFormButton>
              </>
            )}
          </div>
        </nav>

        <div className='relative flex flex-1 overflow-hidden bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper.dark.svg)]'>
          <Designer />
          <DesignerSidebar />
        </div>
      </div>
    </DesignerProvider>
  );
}
