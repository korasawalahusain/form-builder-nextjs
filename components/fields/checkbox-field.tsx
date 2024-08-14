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
import { Checkbox } from '@ui/checkbox';
import { useDesigner } from '@providers';
import { useForm } from 'react-hook-form';
import { IoMdCheckbox } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

type ExtraAttributesType = {
  label: string;
  required?: boolean;
  helperText?: string;
};

export const CheckboxFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'CheckboxField',
  designerButtonElement: {
    icon: IoMdCheckbox,
    label: 'Checkbox Field',
  },
  construct: (id) => ({
    id,
    type: 'CheckboxField',
    extraAttributes: {
      required: false,
      label: 'Checkbox Field',
      helperText: 'Helper Text',
    },
  }),
  formComponent: FormComponent,
  validate: validateCheckboxField,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
};

function validateCheckboxField(
  element: FormElementInstance<ExtraAttributesType>,
  currentValue?: string,
) {
  const value = currentValue || '';

  if (element.extraAttributes.required === true) {
    return value === 'true';
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
  const [value, setValue] = useState<boolean>(() => defaultValue === 'true');

  useEffect(() => setError(isInvalid === true), [isInvalid]);

  function submitValue(checked: boolean) {
    let value = false;
    if (checked === true) value = true;

    setValue(value);
    const stringValue = value ? 'true' : 'false';
    const valid = CheckboxFieldFormElement.validate(element, stringValue);
    setError(!valid);
    if (valid) onChange?.(stringValue);
  }

  const id = `checkbox-${element.id}`;

  return (
    <div className='items-top flex space-x-2'>
      <Checkbox
        id={id}
        checked={value}
        onCheckedChange={submitValue}
        className={cn({ 'border-red-500': error })}
      />
      <div className='grid gap-1.5 leading-none'>
        <Label
          htmlFor={id}
          className={cn({
            'text-red-500': error === true,
          })}
        >
          {element.extraAttributes.label}
          {element.extraAttributes.required === true && '*'}
        </Label>
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
    </div>
  );
}

const propertiesSchema = z.object({
  label: z.string().min(4).max(50),
  helperText: z.string().max(300).optional(),
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
  const id = `checkbox-${element.id}`;

  return (
    <div className='items-top flex space-x-2'>
      <Checkbox id={id} />
      <div className='grid gap-1.5 leading-none'>
        <Label htmlFor={id}>
          {element.extraAttributes.label}
          {element.extraAttributes.required === true && '*'}
        </Label>
        {element.extraAttributes.helperText && (
          <p className='text-[0.8rem] text-muted-foreground'>
            {element.extraAttributes.helperText}
          </p>
        )}
      </div>
    </div>
  );
}
