import React from "react";
import { Link } from "react-router-dom";

const BasicButton = ({
  type = "button",
  onClick,
  variant = "contained",
  color,
  size,
  title,
  className,
  icon: Icon,
  component: Component = "button",
  to,
  disabled = false,
}) => {
  const baseStyles = `w-max tracking-tighter font-bold py-1 px-4 rounded-md ${className}`;

  const buttonStyles =
    variant === "outlined"
      ? `border ${
          color === "primary"
            ? "border-[#1414fe] text-[#1414fe]"
            : color === "success"
            ? "border-green-700 text-green-700"
            : color === "danger"
            ? "border-red-500 text-red-500"
            : color === "warning"
            ? "border-yellow-500 text-orange-500"
            : "border-[#1414fe] text-[#1414fe]"
        } bg-transparent`
      : variant === "text"
      ? `${
          color === "primary"
            ? "text-[#1414fe] hover:bg-[#e0e0ff]"
            : color === "success"
            ? "text-green-700 hover:bg-[#e0ffe0]"
            : color === "danger"
            ? "text-red-500 hover:bg-[#ffe0e0]"
            : color === "warning"
            ? "text-orange-500 hover:bg-[#fff0e0]"
            : "text-[#1414fe] hover:bg-[#e0e0ff]"
        } text-[#1414fe] `
      : variant === "ghost"
      ? `${
          color === "primary"
            ? "text-[#1414fe] hover:bg-[#e0e0ff]"
            : color === "success"
            ? "text-green-700 hover:bg-[#e0ffe0]"
            : color === "danger"
            ? "text-red-500 hover:bg-[#ffe0e0]"
            : color === "warning"
            ? "text-orange-500 hover:bg-[#fff0e0]"
            : "text-[#1414fe] hover:bg-[#e0e0ff]"
        } bg-transparent`
      : `${
          color === "primary"
            ? "bg-[#1414fe] hover:bg-[#0d0db8]"
            : color === "success"
            ? disabled
              ? "bg-gray-400 text-gray-300 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-600"
            : color === "danger"
            ? "bg-red-500 hover:bg-red-400"
            : color === "warning"
            ? "bg-orange-500 hover:bg-orange-400"
            : "bg-[#1414fe] hover:bg-[#0d0db8]"
        } text-white`;

  const disabledStyles =
    "bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-gray-300 border-gray-400";

  const commonStyles = "transition-all duration-300 ease-in-out ";

  const titleStyles = { letterSpacing: "0.02rem" };

  return (
    <>
      {Component === "link" ? (
        <Link
          to={to}
          className={`${baseStyles} ${buttonStyles} ${commonStyles} `}
          style={titleStyles}
        >
          {Icon && <Icon className="mr-2" />} {title}
        </Link>
      ) : (
        <button
          type={type}
          className={`${baseStyles} ${buttonStyles} ${commonStyles} ${
            disabled ? disabledStyles : ""
          }`}
          onClick={onClick}
          disabled={disabled}
          style={titleStyles}
        >
          {Icon && <Icon className="mr-2" />} {title}
        </button>
      )}
    </>
  );
};

export default BasicButton;
