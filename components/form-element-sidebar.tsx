import React from 'react';
import { Separator } from '@ui/separator';
import { FormElements } from './form-elements';
import SidebarButtonElement from './siderbar-button-element';

type Props = {};

export default function FormElementSidebar({}: Props) {
  return (
    <div>
      <p className='text-sm text-foreground/70'>Drag and drop elements</p>
      <Separator className='my-2' />
      <div className='grid grid-cols-1 place-items-center gap-2 md:grid-cols-2'>
        <p className='col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2'>
          Layout Elements
        </p>
        <SidebarButtonElement element={FormElements.TitleField} />
        <SidebarButtonElement element={FormElements.SubTitleField} />
        <SidebarButtonElement element={FormElements.ParagraphField} />
        <SidebarButtonElement element={FormElements.SeparatorField} />
        <SidebarButtonElement element={FormElements.SpacerField} />

        <p className='col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2'>
          Form Elements
        </p>
        <SidebarButtonElement element={FormElements.TextField} />
        <SidebarButtonElement element={FormElements.NumberField} />
        <SidebarButtonElement element={FormElements.TextAreaField} />
        <SidebarButtonElement element={FormElements.DateField} />
        <SidebarButtonElement element={FormElements.SelectField} />
        <SidebarButtonElement element={FormElements.CheckboxField} />
      </div>
    </div>
  );
}
