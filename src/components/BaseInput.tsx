import { Description, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { TbEyeOff, TbEye } from "react-icons/tb";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  required?: boolean;
  description?: string;
  error?: boolean;
  disable?: boolean;
  multiple?: boolean;
  rows?: number;
  startDecorator?: React.ReactNode;
  endDecorator?: React.ReactNode;
}

export const BaseInput: React.FC<BaseInputProps> = ({
  id,
  label,
  required,
  description,
  error,
  multiple,
  rows,
  disable,
  startDecorator,
  endDecorator,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  return (
    <Field>
      <Label
        className={clsx(
          "text-base font-normal text-slate-800 dark:text-slate-100",
          error ? "text-error-500 dark:text-error-500" : "text-slate-800"
        )}
      >
        {label}
        {required && (
          <Label className={"text-error-500 text-base font-normal"}>*</Label>
        )}
      </Label>
      {description && (
        <Description className="text-sm text-slate-600 dark:text-slate-400">
          {description}
        </Description>
      )}

      <div className="relative">
        {startDecorator && (
          <span className="absolute left-0.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
            {startDecorator}
          </span>
        )}
        {multiple ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            id={id}
            disabled={disable}
            className={clsx(
              className,
              "mt-3 block w-full rounded-md border-none ring-1 focus:ring-2 focus:ring-primary-500 bg-white py-1.5 px-3 text-md text-slate-800",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              error ? "ring-red-500" : "ring-slate-400"
            )}
            rows={rows || 4}
          />
        ) : (
          <Input
            {...props}
            id={id}
            type={isPassword && showPassword ? "text" : props.type}
            disabled={disable}
            className={clsx(
              className,
              "mt-3 block w-full rounded-md border-none ring-1 focus:ring-2 focus:ring-primary-500 bg-white py-1.5 px-3 text-md text-slate-800",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              error ? "ring-red-500" : "ring-slate-400"
            )}
          />
        )}
        {endDecorator && (
          <span className="absolute right-0.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
            {endDecorator}
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <TbEye size={20} /> : <TbEyeOff size={20} />}
          </button>
        )}
      </div>
    </Field>
  );
};
