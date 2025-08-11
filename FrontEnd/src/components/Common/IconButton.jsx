import React from "react";

function IconButton({
  text,
  onclick,
  children,
  disabled = false,
  outline = false,
  customClasses = "",
  type = "button",
}){
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
      className={`flex items-center justify-center gap-2 rounded-md px-5 py-2 font-semibold transition-all duration-200
        ${
          outline
            ? "border border-yellow-50 bg-transparent text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900"
            : "bg-yellow-50 text-richblack-900 hover:bg-yellow-100"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${customClasses}
      `}
    >
      {children && <span>{children}</span>}
      <span>{text}</span>
    </button>
  );
}

export default IconButton;
