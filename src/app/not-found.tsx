import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import React from "react";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <React.Fragment>
      <Header />
      <div className="flex items-center justify-center h-dvh bg-gray-50">
        <div className="text-center gap-4 px-6 md:px-0">
          <Image
            src={"/images/not-found.png"}
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
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary-500 text-white font-medium rounded hover:bg-primary-600 transition duration-300"
          >
            Halaman Awal
          </Link>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
