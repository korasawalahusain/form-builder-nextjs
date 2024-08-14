import React from "react";
import { ImSpinner2 } from "react-icons/im";

type Props = {};

export default function BuilderLoading({}: Props) {
  return (
    <div className="flex flex-grow h-full w-full items-center justify-center">
      <ImSpinner2 className="animate-spin h-10 w-10" />
    </div>
  );
}
