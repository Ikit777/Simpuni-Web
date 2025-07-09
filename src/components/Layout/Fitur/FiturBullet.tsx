import { motion } from "framer-motion";

import { IBenefitBullet } from "@/types";
import { childVariants } from "./FiturSection";

const FiturBullet: React.FC<IBenefitBullet> = ({
  title,
  description,
  icon,
}: IBenefitBullet) => {
  return (
    <motion.div
      className="flex flex-col items-center mt-8 gap-3 lg:gap-5 lg:flex-row lg:items-start"
      variants={childVariants}
    >
      <div className="flex justify-center mx-auto lg:mx-0 flex-shrink-0 mt-3 w-fit text-slate-800 dark:text-slate-100">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
        <p className="text-base text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default FiturBullet;
