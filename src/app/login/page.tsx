"use client";

import { BaseButton } from "@/components/Button/BaseButton";
import { BaseInput } from "@/components/BaseInput";
import { Checkbox } from "@headlessui/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TbCheck } from "react-icons/tb";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DefaultLoginType = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  const defaultLoginValues = {
    username: "",
    password: "",
  };

  const {
    control: loginControll,
    handleSubmit: loginSubmit,
    setValue: setFieldValue,
    formState: { errors: loginError },
  } = useForm<DefaultLoginType>({
    mode: "onSubmit",
    defaultValues: defaultLoginValues,
  });

  useEffect(() => {
    const loadRemember = () => {
      try {
        const saved = localStorage.getItem("remember");
        if (saved) {
          setFieldValue("username", saved);
          setEnabled(true);
        }
      } catch (error) {
        console.error("Failed to load username:", error);
      }
    };

    loadRemember();
  }, [setFieldValue]);

  const onSubmit = async (data: DefaultLoginType) => {
    if (enabled) {
      localStorage.setItem("remember", data.username);
    } else {
      localStorage.removeItem("remember");
    }

    const promise = signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    toast.promise(promise, {
      loading: "Loading",
      error: () => {
        return `Terjadi kesalahan saat login, silakan coba kembali`;
      },
    });

    const result = await promise;

    if (!result?.error) {
      router.push("/admin");
    } else {
      toast.error(`Terjadi kesalahan saat login, silakan coba kembali`);
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-[30%] max-w-lg bg-white dark:bg-gray-900/30 py-10 px-10 mx-4 shadow-md gap-4 space-y-4 rounded-md">
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Masuk
            </p>
            <p className="text-base font-normal text-slate-600 dark:text-slate-400">
              Masukkan username atau email dan kata sandi Anda untuk memulai
              aplikasi SIMPUNI
            </p>
          </div>
          <Controller
            name="username"
            control={loginControll}
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <BaseInput
                id="username"
                label="Username atau Email"
                placeholder="Masukkan username atau email Anda"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type="text"
                error={!!loginError.username}
              />
            )}
          />

          <Controller
            name="password"
            control={loginControll}
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <BaseInput
                id="password"
                label="Kata Sandi"
                placeholder="Masukkan kata sandi Anda"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                type="password"
                error={!!loginError.password}
              />
            )}
          />

          {(Object.keys(loginError) as Array<keyof typeof loginError>).some(
            (field) => loginError[field]?.type === "required"
          ) && (
            <p className="text-base font-normal text-error-500">
              Silakan lengkapi semua formulir terlebih dahulu
            </p>
          )}

          <Checkbox
            checked={enabled}
            onChange={setEnabled}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className={clsx(
                "w-5 h-5 flex items-center justify-center rounded border transition-all",
                enabled
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "border-gray-400"
              )}
            >
              {enabled && <TbCheck size={16} />}
            </div>
            <span className="text-gray-800 text-base font-normal dark:text-slate-100">
              Ingat Saya
            </span>
          </Checkbox>

          <BaseButton
            label="Masuk"
            onClick={loginSubmit(onSubmit)}
            className="mt-4"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
