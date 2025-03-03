import React from "react";
import PropTypes from "prop-types";
const Button = ({
  onClick,
  children,
  variant = "primary",
  size = "medium",
  icon = null,
  disabled = false,
  className = "",
  href = null, // Suporte para links
  ...props
}) => {
  const baseStyles =
    "rounded-md font-bold transition duration-300 flex items-center justify-center";
  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };
  const variantStyles = {
    primary: "bg-accent text-card-background hover:bg-primary",
    secondary: "bg-gray-800 text-white hover:bg-gray-900",
    outline: "border-2 border-primary text-primary hover:bg-primary",
    disabled: "bg-gray-300 text-gray-600 cursor-not-allowed",
  };

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${
    disabled ? variantStyles.disabled : variantStyles[variant]
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses} disabled={disabled} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "disabled"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  href: PropTypes.string, // Nova prop para links
};

export default Button;
