import React from "react";

import PlayStoreButton from "./PlayStoreButton";

import { heroDetails } from "@/data/hero";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center pb-0 px-5"
    >
      <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
        <div className="absolute inset-0 h-full w-full bg-hero-background dark:bg-gray-800 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 
  bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]
  dark:via-[rgba(50,50,60,0.5)] dark:to-[rgba(20,20,30,0.5)]"
      ></div>

      <div className="text-center h-[calc(100vh)] flex flex-col justify-center z-10">
        <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-slate-800 dark:text-slate-100 max-w-lg md:max-w-2xl mx-auto">
          {heroDetails.heading}
        </h1>
        <p className="mt-4 text-slate-800 dark:text-slate-100 max-w-lg mx-auto">
          {heroDetails.subheading}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:gap-4 w-fit mx-auto">
          <PlayStoreButton dark />
        </div>
        {/* <Image
          src={heroDetails.centerImageSrc}
          width={384}
          height={340}
          quality={100}
          sizes="(max-width: 768px) 100vw, 384px"
          priority={true}
          unoptimized={true}
          alt="app mockup"
          className="relative mt-6 md:mt-10 mx-auto z-10 mb-6"
        /> */}
      </div>
    </section>
  );
};

export default Hero;
