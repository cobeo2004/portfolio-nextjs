import clsx from "clsx";
import React from "react";

const AboutLayout = ({
  children,
  className,
}: {
  children: JSX.Element;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "p-6 sm:p-8 rounded-xl flex justify-center items-center custom-background space-y-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AboutLayout;
