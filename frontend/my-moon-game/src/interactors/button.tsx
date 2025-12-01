// Button.tsx
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 24px",
        fontSize: "1rem",
        borderRadius: "8px",
        backgroundColor: "#4A90E2",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
};

export default Button;
