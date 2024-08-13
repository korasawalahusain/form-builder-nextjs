import { UserButton } from "@clerk/nextjs";
import React, { PropsWithChildren } from "react";
import { Logo, ThemeSwitcher } from "@/components/index";

type Props = {};

export default function DashboardLayout({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col min-h-screen max-h-screen min-w-full bg-background">
      <nav className="flex h-[60px] px-4 py-2 items-center justify-between border-b border-border">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}
