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
import { Textarea } from '@ui/textarea';
import React, { useEffect } from 'react';
import { useDesigner } from '@providers';
import { useForm } from 'react-hook-form';
import { BsTextParagraph } from 'react-icons/bs';
import { zodResolver } from '@hookform/resolvers/zod';

type ExtraAttributesType = {
  text: string;
};

export const ParagraphFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'ParagraphField',
  designerButtonElement: {
    icon: BsTextParagraph,
    label: 'Paragraph Field',
  },
  construct: (id) => ({
    id,
    type: 'ParagraphField',
    extraAttributes: {
      text: 'Text here',
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
  return <p>{element.extraAttributes.text}</p>;
}

const propertiesSchema = z.object({
  text: z.string().min(4).max(500),
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
          name='text'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
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
      <Label className='text-muted-foreground'>Paragraph Field</Label>
      <p>{element.extraAttributes.text}</p>
    </div>
  );
}
