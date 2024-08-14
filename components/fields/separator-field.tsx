import React from 'react';
import { Label } from '@ui/label';
import { Separator } from '@ui/separator';
import { RiSeparator } from 'react-icons/ri';
import { FormElement } from '../form-elements';

export const SeparatorFieldFormElement: FormElement = {
  type: 'SeparatorField',
  designerButtonElement: {
    icon: RiSeparator,
    label: 'Separator Field',
  },
  construct: (id) => ({
    id,
    extraAttributes: {},
    type: 'SeparatorField',
  }),
  validate: validateTextField,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
};

function validateTextField() {
  return true;
}

function FormComponent() {
  return <Separator />;
}

function PropertiesComponent() {
  return <p>No properties for this element</p>;
}

function DesignerComponent() {
  return (
    <div className='flex w-full flex-col gap-2'>
      <Label className='text-muted-foreground'>Separator Field</Label>
      <Separator />
    </div>
  );
}
