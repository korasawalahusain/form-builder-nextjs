import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

type Props = {};

export default function FormDetailsLoading({}: Props) {
  return (
    <div className='flex h-full w-full flex-grow items-center justify-center'>
      <ImSpinner2 className='h-10 w-10 animate-spin' />
    </div>
  );
}
