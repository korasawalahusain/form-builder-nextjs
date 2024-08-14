'use client';

import React from 'react';
import { Button } from '@ui/button';
import { useDesigner } from '@providers';
import { Separator } from '@ui/separator';
import { FormElements } from './form-elements';
import { AiOutlineClose } from 'react-icons/ai';

type Props = {};

export default function PropertiesFormSidebar({}: Props) {
  const { selectedElement, setSelectedElement } = useDesigner();

  if (!selectedElement) return null;

  const PropertiesForm =
    FormElements[selectedElement?.type].propertiesComponent;

  return (
    <div className='flex flex-col p-2'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-foreground/70'>Element Properties</p>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setSelectedElement(null)}
        >
          <AiOutlineClose />
        </Button>
      </div>

      <Separator className='mb-4' />
      <PropertiesForm element={selectedElement} />
    </div>
  );
}
