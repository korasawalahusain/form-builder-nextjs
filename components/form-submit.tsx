'use client';

import { Button } from '@ui/button';
import { toast } from '@ui/use-toast';
import { submitFormByURL } from '@actions';
import { ImSpinner2 } from 'react-icons/im';
import { HiCursorClick } from 'react-icons/hi';
import React, { useRef, useState, useTransition } from 'react';
import { FormElementInstance, FormElements } from './form-elements';

type Props = {
  formUrl: string;
  content: FormElementInstance[];
};

export default function FormSubmit({ content, formUrl }: Props) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [submitted, setSubmitted] = useState(false);
  const [loading, startTransition] = useTransition();

  function validateForm() {
    content.forEach((element) => {
      const value = formValues.current[element.id] || '';
      const valid = FormElements[element.type].validate(element, value);

      if (!valid) formErrors.current[element.id] = true;
    });

    if (Object.keys(formErrors.current).length > 0) return false;
    return true;
  }

  function submitValue(key: string, value: string) {
    formValues.current[key] = value;
  }

  async function submitForm() {
    try {
      const valid = validateForm();
      if (!valid) setRenderKey(new Date().getTime());

      await submitFormByURL(formUrl, formValues.current);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Somthing went wrong',
      });
    }
  }

  if (submitted) {
    return (
      <>
        <h1 className='text-2xl font-bold'>Form Submitted</h1>
        <p className='text-muted-foreground'>
          Thank you for submitting the form, you can close this page now.
        </p>
      </>
    );
  } else {
    return (
      <>
        {content.map((content, index) => {
          const FormComponent = FormElements[content.type].formComponent;

          return (
            <FormComponent
              key={index}
              element={content}
              isInvalid={formErrors.current[content.id]}
              defaultValue={formValues.current[content.id]}
              onChange={(newValue) => submitValue(content.id, newValue)}
            />
          );
        })}

        <Button
          key={renderKey}
          className='mt-8'
          disabled={loading}
          onClick={() => startTransition(submitForm)}
        >
          {loading ? (
            <ImSpinner2 className='animate-spin' />
          ) : (
            <>
              <HiCursorClick className='m-2' />
              Submit
            </>
          )}
        </Button>
      </>
    );
  }
}
