import React from "react";

const Input = ({ label, type, value, onChange, placeholder, required }) => (
  <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
    <div className="self-stretch justify-start items-start inline-flex">
      <label
        htmlFor={label}
        className="grow shrink basis-0 text-white text-[15px] font-semibold text-left"
      >
        {label}
      </label>
    </div>
    <div className="self-stretch bg-zinc-800 shadow justify-start items-center inline-flex ">
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="grow shrink basis-0 h-[50px] justify-start items-center flex w-full px-3 rounded"
        required={required}
      />
    </div>
  </div>
);

export default Input;
