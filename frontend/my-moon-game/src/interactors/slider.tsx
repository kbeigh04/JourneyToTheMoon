// Contains UI and logic for a basic slider
import React, { useRef, useState } from "react";

interface SliderProps {
  value: number;                
  onChange: (v: number) => void;

  min?: number;                 // NEW
  max?: number;                 // NEW
  
  width?: number;
  height?: number;
  trackColor?: string;

  knobSize?: number;
  knobColor?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,

  width = 200,
  height = 6,
  trackColor = "#ccc",

  knobSize = 24,
  knobColor = "#684ADE",
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const normalize = (val: number) => {
    return Math.min(max, Math.max(min, val));
  };

  const handleDrag = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let pos = e.clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));

    const percentage = pos / rect.width;
    const newValue = normalize(min + percentage * (max - min));

    onChange(newValue);
  };

  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    handleDrag(e);
  };

  const stopDrag = () => setDragging(false);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDrag);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={sliderRef}
      onMouseDown={startDrag}
      style={{
        width,
        height,
        background: trackColor,
        borderRadius: height / 2,
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Knob */}
      <div
        style={{
          width: knobSize,
          height: knobSize,
          borderRadius: "50%",
          background: knobColor,
          position: "absolute",
          top: `calc(50% - ${knobSize / 2}px)`,
          left: `calc(${percent}% - ${knobSize / 2}px)`,
          transition: dragging ? "none" : "left 0.1s",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        }}
      ></div>
    </div>
  );
};

export default Slider;
