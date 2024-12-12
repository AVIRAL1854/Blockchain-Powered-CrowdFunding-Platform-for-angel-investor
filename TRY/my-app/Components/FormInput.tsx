import React from "react";

export interface FormInputInterface {
  name: string;
  placeholder: string;
  type: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string | number;
}

export function FormInput({
  name,
  placeholder,
  type,
  onChange,
  value,
}: FormInputInterface) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor=""
        className="text-xs font-semibold text-black md:text-base font-medium"
      >
        {name}
      </label>
      <input
        placeholder={placeholder}
        type={type}
        className="bg-red-200 py-3 px-2 rounded-lg text-white focus:border-none outline-none md:py-4 px-3 shadow-lg shadow-red-200"
        onChange={onChange}
        value={value}
        autoComplete="value"
      />
    </div>
  );
}

export function FormPara({
  name,
  placeholder,
  onChange,
  value,
}: FormInputInterface) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="description"
        className="text-xs font-semibold text-black md:text-base font-medium"
      >
        {name}
      </label>
      <textarea
        id="description"
        name="description"
        placeholder={placeholder}
        rows={5}
        cols={50}
        onChange={onChange}
        value={value}
        className="rounded-lg px-2 py-3 bg-red-200 focus:border-none outline-none md:py-4 px-3"
      ></textarea>
    </div>
  );
}
