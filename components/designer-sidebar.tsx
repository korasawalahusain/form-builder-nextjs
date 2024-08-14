'use client';

import React from 'react';
import { useDesigner } from '@providers';
import FormElementSidebar from './form-element-sidebar';
import PropertiesFormSidebar from './properties-form-sidebar';

type Props = {};

export default function DesignerSidebar({}: Props) {
  const { selectedElement } = useDesigner();

  return (
    <aside className='flex w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4'>
      {selectedElement !== null ? (
        <PropertiesFormSidebar />
      ) : (
        <FormElementSidebar />
      )}
    </aside>
  );
}
