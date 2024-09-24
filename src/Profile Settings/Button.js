import React from "react";

const Button = ({ children, variant = "primary", ...props }) => {
  const variants = {
    primary:
      "w-full h-14 bg-[#2D78E6] rounded-[36px] justify-center items-center gap-2.5 inline-flex",
    secondary:
      "w-full h-14 rounded-[36px] border border-[#FF0000] justify-center items-center gap-2.5 inline-flex",
  };

  return (
    <button type="submit" className={variants[variant]} {...props}>
      {children}
    </button>
  );
};

export default Button;
