'use client';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@ui/form';
import { z } from 'zod';
import {
  FormElement,
  FormComponentProps,
  FormElementInstance,
  DesignerComponentProps,
  PropertiesComponentProps,
} from '../form-elements';
import { cn } from '@lib';
import { Label } from '@ui/label';
import { Input } from '@ui/input';
import { Switch } from '@ui/switch';
import { Bs123 } from 'react-icons/bs';
import { useDesigner } from '@providers';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

type ExtraAttributesType = {
  label: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
};

export const NumberFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'NumberField',
  designerButtonElement: {
    icon: Bs123,
    label: 'Number Field',
  },
  construct: (id) => ({
    id,
    type: 'NumberField',
    extraAttributes: {
      required: false,
      placeholder: '0',
      label: 'Number Field',
      helperText: 'Helper Text',
    },
  }),
  validate: validateNumberField,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
};

function validateNumberField(
  element: FormElementInstance<ExtraAttributesType>,
  currentValue?: string,
) {
  const value = currentValue || '';

  if (element.extraAttributes.required === true) {
    return value.length > 0;
  }

  return true;
}

function FormComponent({
  element,
  onChange,
  isInvalid,
  defaultValue,
}: FormComponentProps<ExtraAttributesType>) {
  const [error, setError] = useState<boolean>();
  const [value, setValue] = useState<string>(() => defaultValue || '');

  useEffect(() => setError(isInvalid === true), [isInvalid]);

  function submitValue() {
    const valid = NumberFieldFormElement.validate(element, value);
    setError(!valid);
    if (valid) onChange?.(value);
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      <Label
        className={cn({
          'text-red-500': error === true,
        })}
      >
        {element.extraAttributes.label}
        {element.extraAttributes.required === true && '*'}
      </Label>
      <Input
        type='number'
        value={value}
        onBlur={submitValue}
        className={cn({
          'text-red-500': error === true,
        })}
        placeholder={element.extraAttributes.placeholder}
        onChange={(event) => setValue(String(event.target.value))}
      />
      {element.extraAttributes.helperText && (
        <p
          className={cn('text-[0.8rem] text-muted-foreground', {
            'text-red-500': error === true,
          })}
        >
          {element.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}

const propertiesSchema = z.object({
  label: z.string().min(4).max(50),
  helperText: z.string().max(300).optional(),
  placeholder: z.string().max(50).optional(),
  required: z.boolean().optional().default(false),
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
          name='label'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The label of the Field. <br /> It will be displayed above the
                field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='placeholder'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The placeholder of the Field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='helperText'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The helper text of the Field. <br /> It will be displayed below
                the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='required'
          control={form.control}
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
              <div className='space-y-0.5'>
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the Field. <br /> It will be displayed
                  below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
    <div className='flex w-full flex-col gap-2'>
      <Label>
        {element.extraAttributes.label}
        {element.extraAttributes.required === true && '*'}
      </Label>
      <Input
        readOnly
        disabled
        type='number'
        placeholder={element.extraAttributes.placeholder}
      />
      {element.extraAttributes.helperText && (
        <p className='text-[0.8rem] text-muted-foreground'>
          {element.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}
