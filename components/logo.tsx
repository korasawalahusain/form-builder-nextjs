import React from 'react';
import Link from 'next/link';

type Props = {};

export default function Logo({}: Props) {
  return (
    <Link
      href='/'
      className='truncate bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent hover:cursor-pointer'
    >
      Husain K&apos;s PageForm
    </Link>
  );
}
