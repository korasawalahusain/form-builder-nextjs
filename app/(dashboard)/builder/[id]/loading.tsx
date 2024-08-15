import React from 'react';
import { Button } from '@ui/button';
import { Skeleton } from '@ui/skeleton';
import { Separator } from '@ui/separator';
import { HiSaveAs } from 'react-icons/hi';
import { MdOutlinePublish, MdPreview } from 'react-icons/md';

type Props = {};

export default function BuilderLoading({}: Props) {
  return (
    <div className='flex h-full w-full flex-col'>
      <nav className='flex items-center justify-between gap-3 border-b-2 p-4'>
        <h2 className='flex flex-row space-x-2 truncate font-medium'>
          <span className='text-muted-foreground'>Form:</span>
          <Skeleton className='w-40'>
            <span className='opacity-0'>Loading</span>
          </Skeleton>
        </h2>
        <div className='flex items-center gap-2'>
          <Button variant='outline' className='gap-2' disabled>
            <MdPreview className='h-6 w-6' />
            Preview
          </Button>

          <Button variant='outline' className='gap-2' disabled>
            <HiSaveAs className='h-4 w-4' />
            Save
          </Button>

          <Button
            disabled
            className='gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white'
          >
            <MdOutlinePublish className='h-4 w-4' />
            Publish
          </Button>
        </div>
      </nav>

      <div className='relative flex flex-1 overflow-hidden bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper.dark.svg)]'>
        <div className='w-full p-4'>
          <div className='m-auto flex h-full max-w-[920px] flex-1 flex-grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background'>
            <div className='flex w-full flex-col gap-2 p-4'>
              <DesignerElementLoadingOverlay />
              <DesignerElementLoadingOverlay />
              <DesignerElementLoadingOverlay />
            </div>
          </div>
        </div>

        <aside className='flex w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4'>
          <div>
            <p className='text-sm text-foreground/70'>Drag and drop elements</p>
            <Separator className='my-2' />
            <div className='grid grid-cols-1 place-items-center gap-2 md:grid-cols-2'>
              <p className='col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2'>
                Layout Elements
              </p>
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />

              <p className='col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2'>
                Form Elements
              </p>
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
              <SidebarButtonLaodingOverlay />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SidebarButtonLaodingOverlay() {
  return (
    <Skeleton>
      <Button
        disabled
        variant='outline'
        className='flex h-[120px] w-[120px] cursor-grab flex-col gap-2'
      >
        <Skeleton className='h-8 w-8' />
        <Skeleton>
          <p className='w-16 text-xs opacity-0'>Field label</p>
        </Skeleton>
      </Button>
    </Skeleton>
  );
}

function DesignerElementLoadingOverlay() {
  return (
    <Skeleton className='flex h-[120px] flex-col rounded-md ring-1 ring-inset ring-accent' />
  );
}
