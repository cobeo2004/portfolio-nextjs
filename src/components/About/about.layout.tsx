import clsx from "clsx";
import { motion } from "framer-motion";
import { type JSX } from "react";

const AboutLayout = ({
  children,
  className,
}: {
  children: JSX.Element;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={clsx(
        "p-6 sm:p-8 rounded-xl flex justify-center items-center custom-background space-y-8",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default AboutLayout;
