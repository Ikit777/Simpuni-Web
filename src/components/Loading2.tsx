import Lottie, { LottieRefCurrentProps } from "lottie-react";
import loading from "../../public/lottie/loading2.json";
import { useRef, useEffect } from "react";

export default function Loading2() {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5);
    }
  }, []);

  return (
    <div className="flex-1 z-[999] flex self-center items-center justify-center">
      <Lottie
        lottieRef={lottieRef}
        animationData={loading}
        loop={true}
        className="h-[30%] w-[30%]"
        autoPlay
      />
    </div>
  );
}
