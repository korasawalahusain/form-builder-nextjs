import React, { PropsWithChildren } from 'react';
import { Logo, ThemeSwitcher } from '@components';

type Props = {};

export default function AuthLayout({ children }: PropsWithChildren<Props>) {
  return (
    <div className='flex h-[100svh] w-[100svw] flex-col overflow-hidden bg-background'>
      <nav className='flex h-[60px] items-center justify-between border-b border-border px-4 py-2'>
        <Logo />
        <div className='flex items-center gap-4'>
          <ThemeSwitcher />
        </div>
      </nav>
      <main className='flex flex-1 flex-col items-center justify-center overflow-y-auto overflow-x-hidden'>
        {children}
      </main>
    </div>
  );
}
