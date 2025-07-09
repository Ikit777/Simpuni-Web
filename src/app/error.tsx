"use client";

import { useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import React from "react";
import { Footer } from "react-day-picker";
import { BaseButton } from "@/components/Button/BaseButton";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <React.Fragment>
      <Header />
      <div className="flex items-center justify-center h-dvh bg-gray-50">
        <div className="text-center gap-4 px-6 md:px-0">
          <Image
            src={"/images/error.png"}
            width={500}
            height={500}
            objectFit="contain"
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            unoptimized={true}
            alt="app mockup"
            className="relative mx-auto z-10"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ops, Terjadi Kesalahan!
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, telah terjadi kesalahan pada halaman, silakan coba kembali.
          </p>
          <BaseButton className="!w-[200px]" label="Coba Lagi" onClick={() => reset()} />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
