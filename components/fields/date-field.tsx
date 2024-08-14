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
import { format } from 'date-fns';
import { Label } from '@ui/label';
import { Input } from '@ui/input';
import { Switch } from '@ui/switch';
import { Button } from '@ui/button';
import { Calendar } from '@ui/calendar';
import { useDesigner } from '@providers';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { BsFillCalendarHeartFill } from 'react-icons/bs';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';

type ExtraAttributesType = {
  label: string;
  required?: boolean;
  helperText?: string;
};

export const DateFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'DateField',
  designerButtonElement: {
    label: 'Date Field',
    icon: BsFillCalendarHeartFill,
  },
  construct: (id) => ({
    id,
    type: 'DateField',
    extraAttributes: {
      required: false,
      label: 'Date Field',
      helperText: 'Pick a date',
    },
  }),
  validate: validateDateField,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
};

function validateDateField(
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
  const [date, setDate] = useState<Date | undefined>(() =>
    !!defaultValue ? new Date(defaultValue) : undefined,
  );

  useEffect(() => setError(isInvalid === true), [isInvalid]);

  function submitValue(date: Date | undefined) {
    setDate(date);

    const value = date?.toUTCString() || '';
    const valid = DateFieldFormElement.validate(element, value);
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn('w-full justify-start text-left font-normal', {
              'border-red-500': error,
              'text-muted-foreground': !date,
            })}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='single'
            selected={date}
            onSelect={submitValue}
          />
        </PopoverContent>
      </Popover>
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
  return (
    <div className='flex w-full flex-col gap-2'>
      <Label>
        {element.extraAttributes.label}
        {element.extraAttributes.required === true && '*'}
      </Label>
      <Button
        variant='outline'
        className='w-full justify-start text-left font-normal'
      >
        <CalendarIcon className='mr-2 h-4 w-4' />
        <span>Pick a date</span>
      </Button>
      {element.extraAttributes.helperText && (
        <p className='text-[0.8rem] text-muted-foreground'>
          {element.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}
