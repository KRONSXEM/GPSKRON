import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

export const RotateMap = () => {
  const map = useMap();
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [initialBearing, setInitialBearing] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false);
        setInitialMousePosition(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isCtrlPressed && initialMousePosition) {
        const deltaX = e.clientX - initialMousePosition.x;
        const newBearing = initialBearing + deltaX / 10;
        map.setBearing(newBearing);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isCtrlPressed) {
        setInitialMousePosition({ x: e.clientX, y: e.clientY });
        setInitialBearing(map.getBearing());
      }
    };

    const handleMouseUp = () => {
      if (isCtrlPressed) {
        setInitialMousePosition(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isCtrlPressed, initialMousePosition, initialBearing, map]);

  return null;
};
