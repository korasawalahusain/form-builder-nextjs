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
import { Input } from '@ui/input';
import React, { useEffect } from 'react';
import { useDesigner } from '@providers';
import { useForm } from 'react-hook-form';
import { LuHeading1 } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';

type ExtraAttributesType = {
  title: string;
};

export const TitleFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'TitleField',
  designerButtonElement: {
    icon: LuHeading1,
    label: 'Title Field',
  },
  construct: (id) => ({
    id,
    type: 'TitleField',
    extraAttributes: {
      title: 'Title Field',
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
  return <p className='text-xl'>{element.extraAttributes.title}</p>;
}

const propertiesSchema = z.object({
  title: z.string().min(4).max(50),
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
          name='title'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
    <div className='flex w-full flex-col gap-2'>
      <Label className='text-muted-foreground'>Title Field</Label>
      <p className='text-xl'>{element.extraAttributes.title}</p>
    </div>
  );
}
