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
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@ui/select';
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
import { Button } from '@ui/button';
import { Switch } from '@ui/switch';
import { useDesigner } from '@providers';
import { useForm } from 'react-hook-form';
import { Separator } from '@ui/separator';
import { RxDropdownMenu } from 'react-icons/rx';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';

type ExtraAttributesType = {
  label: string;
  options: string[];
  required?: boolean;
  helperText?: string;
  placeholder?: string;
};

export const SelectFieldFormElement: FormElement<ExtraAttributesType> = {
  type: 'SelectField',
  designerButtonElement: {
    icon: RxDropdownMenu,
    label: 'Select Field',
  },
  construct: (id) => ({
    id,
    type: 'SelectField',
    extraAttributes: {
      options: [],
      required: false,
      label: 'Select Field',
      helperText: 'Helper Text',
      placeholder: 'Value Here...',
    },
  }),
  validate: validateSelectField,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
};

function validateSelectField(
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

  function submitValue(value: string) {
    setValue(value);

    const valid = SelectFieldFormElement.validate(element, value);
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
      <Select defaultValue={value} onValueChange={submitValue}>
        <SelectTrigger
          className={cn('w-full', {
            'border-red-500': error,
          })}
        >
          <SelectValue placeholder={element.extraAttributes.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {element.extraAttributes.options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
  options: z.array(z.string()).default([]),
  helperText: z.string().max(300).optional(),
  placeholder: z.string().max(50).optional(),
  required: z.boolean().optional().default(false),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  element,
}: PropertiesComponentProps<ExtraAttributesType>) {
  const { updateElement, setSelectedElement } = useDesigner();

  const form = useForm<PropertiesSchemaType>({
    mode: 'onSubmit',
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
    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form className='space-y-3' onSubmit={form.handleSubmit(saveChanges)}>
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
        <Separator />
        <FormField
          name='options'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel>Options</FormLabel>
                <Button
                  variant='outline'
                  className='gap-2'
                  onClick={(event) => {
                    event.preventDefault();
                    form.setValue('options', field.value.concat('New Option'));
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className='flex flex-col gap-2'>
                {form.watch('options').map((option, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between gap-1'
                  >
                    <Input
                      placeholder=''
                      value={option}
                      onChange={(event) => {
                        field.value[index] = event.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={(event) => {
                        event.preventDefault();

                        const options = [...field.value];
                        options.splice(index, 1);
                        field.onChange(options);
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>
              <FormDescription>
                The helper text of the Field. <br /> It will be displayed below
                the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
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
        <Separator />
        <Button className='w-full' type='submit'>
          Save
        </Button>
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
      <Select>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={element.extraAttributes.placeholder} />
        </SelectTrigger>
      </Select>
      {element.extraAttributes.helperText && (
        <p className='text-[0.8rem] text-muted-foreground'>
          {element.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}
