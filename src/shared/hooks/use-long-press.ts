import { useRef, useState } from "react";

export interface UseLongPressProps {
  onClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onTouchStart?: (event: React.TouchEvent) => void;
  onTouchEnd?: (event: React.TouchEvent) => void;
}

export const useLongPress = ({
  onClick,
  onMouseDown,
  onMouseUp,
  onContextMenu,
  onTouchStart,
  onTouchEnd,
}: UseLongPressProps = {}) => {
  const [action, setAction] = useState<"longpress" | "click">();
  const [elementId, setElementId] = useState<string>();

  const timerRef = useRef<NodeJS.Timeout>();
  const isLongPress = useRef(false);

  const startPressTimer = (id: string) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      if (action === "longpress") {
        isLongPress.current = false;
        setAction(undefined);

        return;
      }

      isLongPress.current = true;
      setAction("longpress");
      setElementId(id);
    }, 500);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    if (isLongPress.current) return;
    // setAction("click");

    if (typeof onClick === "function") onClick(e);
  };

  const handleOnMouseDown = (e: React.MouseEvent) => {
    startPressTimer(e.currentTarget.id);

    if (typeof onMouseDown === "function") onMouseDown(e);
  };

  const handleOnMouseUp = (e: React.MouseEvent) => {
    clearTimeout(timerRef.current);

    if (typeof onMouseUp === "function") onMouseUp(e);
  };

  const handlerOnContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (action === "longpress") {
      isLongPress.current = false;
      setAction(undefined);

      return;
    }

    isLongPress.current = true;
    setAction("longpress");

    setElementId(e.currentTarget.id);

    if (typeof onContextMenu === "function") onContextMenu(e);
  };

  const handleOnTouchStart = (e: React.TouchEvent) => {
    startPressTimer(e.currentTarget.id);

    if (typeof onTouchStart === "function") onTouchStart(e);
  };

  const handleOnTouchEnd = (e: React.TouchEvent) => {
    if (action === "longpress") return;
    clearTimeout(timerRef.current);

    if (typeof onTouchEnd === "function") onTouchEnd(e);
  };

  return {
    action,
    elementId,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onContextMenu: handlerOnContextMenu,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
};
