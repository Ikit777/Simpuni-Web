"use client";

import {
  Field,
  Label,
  Description,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Button,
} from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { LuChevronDown, LuX } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";

interface SelectProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  disable?: boolean;
  disableText?: string;
  notFoundText?: string;
  isSearch?: boolean;
  isSorted?: boolean;
  error?: boolean;
  loading?: boolean;
  value?: any;
  onChange: (item: any) => void;
  onOpen?: () => void;
  data?: any[];
}

export const BaseSelect: React.FC<SelectProps> = ({
  label,
  description,
  placeholder,
  required,
  isSearch = false,
  error,
  loading = false,
  isSorted = false,
  notFoundText = "Data tidak ditemukan",
  value,
  onChange,
  onOpen = () => {},
  data = [],
}) => {
  const [search, setSearch] = useState<string>("");

  const filteredData = data
    ?.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) => {
      if (!isSorted) {
        return 0;
      }

      return a.label.localeCompare(b.label, undefined, { numeric: true });
    });

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

      <Listbox value={value} onChange={onChange} disabled={loading}>
        {({ open }) => (
          <>
            <ListboxButton
              className={clsx(
                "mt-3 relative block w-full rounded-md ring-1 focus:ring-2 focus:ring-primary-500 bg-white/5 py-1.5 pr-8 pl-3 text-left text-md text-slate-800",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                error ? "ring-red-500" : "ring-slate-400"
              )}
              onClick={() => {
                if (open == false) {
                  onOpen?.();
                }
              }}
            >
              {value
                ? data?.find((item) => item.value === value)?.label
                : placeholder}
              <LuChevronDown
                className={clsx(
                  "absolute top-2.5 right-2.5 w-5 h-5 transition-transform duration-300",
                  open ? "rotate-180" : "rotate-0"
                )}
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              transition
              className={clsx(
                "w-[var(--button-width)] z-[9999999] rounded-md mt-3 ring-1 shadow-sm ring-slate-200 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
              )}
            >
              {isSearch && (
                <div className="relative w-full p-2">
                  <input
                    type="text"
                    placeholder="Pencarian"
                    className="w-full border rounded-md py-2 px-4 text-md pr-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    onClick={() => setSearch("")}
                    className={clsx(
                      "absolute right-5 top-1/2 transform -translate-y-1/2",
                      search === "" ? "hidden" : "flex"
                    )}
                  >
                    <LuX className="w-5 h-5" />
                  </Button>
                </div>
              )}
              {loading ? (
                <div className="w-full flex items-center justify-center p-2">
                  <TbLoader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-2 text-gray-500 text-center">
                  {notFoundText}
                </div>
              ) : (
                filteredData.map((item) => (
                  <ListboxOption
                    key={item.value}
                    value={item}
                    className="group flex cursor-pointer items-center gap-2 rounded-md py-1.5 px-3 select-none data-[focus]:bg-white/10"
                  >
                    <MdCheck
                      className={clsx(
                        "w-4 h-4",
                        value === item.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="text-md text-slate-800">{item.label}</div>
                  </ListboxOption>
                ))
              )}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </Field>
  );
};
