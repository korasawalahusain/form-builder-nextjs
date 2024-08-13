import React from "react";
import Link from "next/link";

type Props = {};

export default function Logo({}: Props) {
  return (
    <Link
      href="/"
      className="font-bold text-3xl hover:cursor-pointer bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text"
    >
      Husain K&apos;s PageForm
    </Link>
  );
}
