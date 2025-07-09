import { Button } from "@headlessui/react";
import clsx from "clsx";

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  label?: string;
  children?: React.ReactNode;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  id,
  label,
  className,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      id={id}
      className={clsx(
        className,
        "inline-flex w-full items-center justify-center whitespace-nowrap text-base font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "z-0 px-4 py-2 rounded-md text-white bg-gradient-to-br from-primary-500 via-blue-500 to-neutral-500 bg-size-400 hover:from-primary-600 hover:via-neutral-600 hover:to-blue-600 transition-all ease-in-out duration-500 font-medium text-center"
      )}
    >
      {label}
      {children}
    </Button>
  );
};
