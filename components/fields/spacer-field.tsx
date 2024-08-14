'use client';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@ui/form';
import { z } from 'zod';
import {
  FormElement,
  FormComponentProps,
  DesignerComponentProps,
  PropertiesComponentProps,
} from '../form-elements';
import { Label } from '@ui/label';
import { Slider } from '@ui/slider';
import { useDesigner } from '@providers';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuSeparatorHorizontal } from 'react-icons/lu';

type ExtraAttributesType = {
  height: number;
};

export const SpacerFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'SpacerField',
  designerButtonElement: {
    label: 'Spacer Field',
    icon: LuSeparatorHorizontal,
  },
  construct: (id) => ({
    id,
    type: 'SpacerField',
    extraAttributes: {
      height: 20,
    },
  }),
  validate: validateTextField,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
};

function validateTextField() {
  return true;
}

function FormComponent({ element }: FormComponentProps<ExtraAttributesType>) {
  return (
    <div style={{ height: element.extraAttributes.height, width: '100%' }} />
  );
}

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  element,
}: PropertiesComponentProps<ExtraAttributesType>) {
  const { updateElement } = useDesigner();

  const form = useForm<PropertiesSchemaType>({
    mode: 'onBlur',
    defaultValues: {
      ...element.extraAttributes,
    },
    resolver: zodResolver(propertiesSchema),
  });

  useEffect(() => {
    form.reset({ ...element.extraAttributes });
  }, [element, form]);

  function saveChanges(values: PropertiesSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...values,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        className='space-y-3'
        onBlur={form.handleSubmit(saveChanges)}
        onSubmit={form.handleSubmit(saveChanges)}
      >
        <FormField
          name='height'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch('height')}</FormLabel>
              <FormControl className='pt-2'>
                <Slider
                  min={5}
                  step={1}
                  max={200}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function DesignerComponent({
  element,
}: DesignerComponentProps<ExtraAttributesType>) {
  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <Label>Spacer Field: {element.extraAttributes.height}px</Label>
      <LuSeparatorHorizontal className='h-8 w-8' />
    </div>
  );
}
