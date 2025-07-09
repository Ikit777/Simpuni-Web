import { Button } from "@headlessui/react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  label?: string;
}

export const SecondaryButton: React.FC<ButtonProps> = ({
  id,
  label,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      id={id}
      className={clsx(
        className,
        "inline-flex w-full items-center justify-center whitespace-nowrap text-base font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "z-0 px-4 py-2 rounded-md text-slate-800 bg-white ring-1 ring-primary-500 hover:bg-slate-200 transition-all ease-in-out duration-500 font-medium text-center"
      )}
    >
      {label}
    </Button>
  );
};
