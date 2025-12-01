
import React from "react";
import screen from "./assets/startScreen.png";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `url(${screen}) center/cover no-repeat`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={onStart}
        style={{
          width: "150px",
          height: "60px",
          fontSize: "1.2rem",
        }}
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
