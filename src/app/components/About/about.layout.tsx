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
        "p-16 rounded-xl flex justify-center items-center custom-background space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AboutLayout;
